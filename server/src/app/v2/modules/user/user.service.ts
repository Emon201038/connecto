import bcrypt from "bcryptjs";
import { OtpType } from "../../../../../prisma/generated/enums";
import { UserCreateInput } from "../../../../../prisma/generated/models";
import prisma from "../../../config/db";
import AppError from "../../../helpers/appError";
import { generateOtp } from "../../../utils/generateOtp";
import { sendEmail } from "../../../utils/sendEmail";
import { envVars } from "../../../config/env";

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

  console.log(otp);
  const res = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({ data: payload });
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
      subject: "Verify your account",
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
};

const verifyUserRegister = async (otp: number, userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError(404, "User not found");
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

  const res = await prisma.$transaction(async (tx) => {
    await tx.otp.update({
      where: { id: otpDoc.id },
      data: { isUsed: true },
    });
    const updatedUser = await tx.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    return updatedUser;
  });
};

export const UserService = { processRegister };
