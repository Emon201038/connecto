import bcrypt from "bcryptjs";
import prisma from "../../../config/db";
import { Response } from "express";
import { generateJwt } from "../../../utils/jwt";
import { envVars } from "../../../config/env";
import { setAuthCookies } from "../../../utils/cookie";
import AppError from "../../../helpers/appError";
import { sendEmail } from "../../../utils/sendEmail";
import { generateOtp } from "../../../utils/generateOtp";
import { OtpType } from "../../../../../prisma/generated/enums";

const credentialsLogin = async (
  res: Response,
  userInput: string,
  password: string,
) => {
  if (!userInput || !password) {
    throw new Error("Email or phone number and password is required");
  }
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: userInput }, { phone: userInput }],
      isDeleted: false,
      isDisabled: false,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }

  if (user.isDisabled) {
    throw new AppError(400, "User is disabled");
  }
  if (user.isDeleted) {
    throw new AppError(400, "User is deleted");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const twoFactor = user.twoFactor as { active: boolean; secret: string };
  if (twoFactor.active) {
    const otp = generateOtp(6);
    const token = generateJwt(
      { id: user.id, email: user.email, role: user.role },
      twoFactor.secret,
      "10m",
    );
    await prisma.otp.create({
      data: {
        otp: bcrypt.hashSync(otp, 10),
        userId: user.id,
        type: OtpType.TWO_FACTOR,
        expiredAt: new Date(Date.now() + 10 * 60 * 1000),
        token,
      },
    });
    await sendEmail({
      to: user.email,
      templateName: "two-factor-otp",
      subject: "Two-factor authentication",
      templateData: {
        companyName: envVars.APP_NAME,
        resetUrl: envVars.CLIENT_URL,
        supportEmail: "emdadul2580@gmail.com",
        code: otp,
        expiryMinutes: 10,
        name: user.fullName,
      },
    });

    return {
      need2fa: true,
      token,
    };
  }

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

  setAuthCookies(res, { accessToken, refreshToken });

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
};

export const AuthService = { credentialsLogin };
