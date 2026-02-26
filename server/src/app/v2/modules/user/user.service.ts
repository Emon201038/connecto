import bcrypt from "bcryptjs";
import { OtpType } from "../../../../../prisma/generated/enums";
import { UserCreateInput } from "../../../../../prisma/generated/models";
import prisma from "../../../config/db";
import AppError from "../../../helpers/appError";
import { generateOtp } from "../../../utils/generateOtp";
import { sendEmail } from "../../../utils/sendEmail";
import { envVars } from "../../../config/env";
import { generateJwt } from "../../../utils/jwt";
import { setAuthCookies } from "../../../utils/cookie";
import { Response } from "express";
import { generateUsername } from "../../../utils/generateUsername";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { Prisma } from "../../../../../prisma/generated/browser";
import {
  userBooleanFields,
  userDateFields,
  userSearchableFields,
} from "./user.constant";

const processRegister = async (payload: UserCreateInput) => {
  const isExist = await prisma.user.findFirst({
    where: {
      OR: [{ email: payload.email }, { phone: payload.phone }],
    },
  });
  if (isExist) {
    throw new AppError(409, "User already exist");
  }

  const otp = generateOtp(6);

  const user = await prisma.$transaction(async (tx) => {
    const fullName = payload.lastName
      ? `${payload.firstName} ${payload.lastName}`
      : payload.firstName;
    const username = await generateUsername(
      payload.firstName,
      payload?.lastName,
    );
    const user = await tx.user.create({
      data: {
        ...payload,
        fullName,
        username,
        password: bcrypt.hashSync(payload.password, 10),
      },
    });
    await tx.otp.create({
      data: {
        type: OtpType.REGISTER_ACCOUNT,
        userId: user.id,
        otp: bcrypt.hashSync(otp, 10),
        expiredAt: new Date(Date.now() + 5 * 60 * 1000),
        token: "",
      },
    });

    sendEmail({
      to: user.email,
      subject: "Account Activatio Email",
      templateName: "account-activation",
      templateData: {
        companyName: envVars.APP_NAME,
        supportEmail: "emdadul2580@gmail.com",
        code: otp,
        expiryMinutes: 10,
        name: user.fullName,
      },
    });
    return user;
  });

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
  };
};

const verifyUserRegister = async (
  res: Response,
  otp: number,
  userId: string,
) => {
  if (!otp) {
    throw new AppError(400, "Otp is required");
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.isVerified) {
    throw new AppError(400, "User already verified");
  }

  const otpDoc = await prisma.otp.findFirst({
    where: { userId: user.id, type: OtpType.REGISTER_ACCOUNT },
  });
  if (!otpDoc) {
    throw new AppError(404, "Invalid otp");
  }

  const isMatchedOtp = await bcrypt.compare(otp.toString(), otpDoc.otp);
  if (!isMatchedOtp) {
    throw new AppError(400, "Invalid otp");
  }

  if (otpDoc.isUsed) {
    throw new AppError(400, "Otp already used");
  }

  if (otpDoc.expiredAt < new Date()) {
    throw new AppError(400, "Otp expired");
  }

  const data = await prisma.$transaction(async (tx) => {
    await tx.otp.update({
      where: { id: otpDoc.id },
      data: { isUsed: true },
    });
    await tx.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    const accessToken = generateJwt(
      { id: user.id, role: user.role, email: user.email },
      envVars.JWT_ACCESS_TOKEN_SECRET,
      envVars.JWT_ACCESS_TOKEN_EXPIRES_IN,
    );
    const refreshToken = generateJwt(
      { id: user.id, role: user.role, email: user.email },
      envVars.JWT_REFRESH_TOKEN_SECRET,
      envVars.JWT_REFRESH_TOKEN_EXPIRES_IN,
    );

    setAuthCookies(res, {
      accessToken,
      refreshToken,
    });

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        isDeleted: user.isDeleted,
        deletedAt: user.deletedAt,
        isDisabled: user.isDisabled,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      accessToken,
      refreshToken,
    };
  });
};

const getUsersFromDB = async (
  options: Record<string, string>,
  filters: Record<string, any>,
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.UserWhereInput[] = [];
  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        const value = filterData[key];

        if (userBooleanFields.includes(key)) {
          return {
            [key]: {
              equals: value === "true" || value === true,
            },
          };
        }

        if (userDateFields.includes(key)) {
          return {
            [key]: {
              equals: new Date(value),
            },
          };
        }

        return {
          [key]: {
            equals: value,
          },
        };
      }),
    });
  }

  const users = await prisma.user.findMany({
    omit: {
      password: true,
    },
    where: { AND: andConditions },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.user.count({
    where: {
      AND: andConditions,
    },
  });
  return {
    meta: {
      total,
      totalPages: Math.ceil(total / limit) || 0,
      page,
      limit,
    },
    data: users,
  };
};

const getSingleUser = async (key: "username" | "id", value: string) => {
  const where = key === "id" ? { id: value } : { username: value };

  const user = await prisma.user.findUnique({
    where,
    omit: { password: true },
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return user;
};

const HardDeleteUser = async (key: "username" | "id", value: string) => {
  const where = key === "id" ? { id: value } : { username: value };

  const user = await prisma.user.delete({
    where,
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return user;
};

const softDeleteUser = async (key: "username" | "id", value: string) => {
  const where = key === "id" ? { id: value } : { username: value };

  const user = await prisma.user.update({
    where,
    data: {
      isDeleted: true,
    },
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return user;
};

export const UserService = {
  processRegister,
  verifyUserRegister,
  getUsersFromDB,
  getSingleUser,
  HardDeleteUser,
  softDeleteUser,
};
