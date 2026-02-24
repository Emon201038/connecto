import bcrypt from "bcryptjs";
import { OtpType } from "../../../../../prisma/generated/enums";
import { OtpCreateInput } from "../../../../../prisma/generated/models";
import prisma from "../../../config/db";
import AppError from "../../../helpers/appError";
import { sendEmail } from "../../../utils/sendEmail";
import { envVars } from "../../../config/env";
import { generateJwt } from "../../../utils/jwt";

const resendOtp = async (
  payload: Omit<OtpCreateInput, "user">,
  userId: string,
) => {
  const emailTemplate = () => {
    switch (payload.type) {
      case OtpType.REGISTER_ACCOUNT:
        return "account-activation";
      case OtpType.RESET_PASSWORD:
        return "reset-password";
      case OtpType.TWO_FACTOR:
        return "two-factor-otp";
      default:
        throw new AppError(500, "Failed to resend otp. Invalid type");
    }
  };

  const result = await prisma.$transaction(async (tx) => {
    await tx.otp.deleteMany({
      where: {
        userId,
        isUsed: false,
        type: payload.type,
        expiredAt: { gt: new Date() },
      },
    });

    const user = await tx.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        fullName: true,
        id: true,
        role: true,
        twoFactor: true,
      },
    });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    const twoFactor = user.twoFactor as { active: boolean; secret: string };

    await tx.otp.create({
      data: {
        otp: await bcrypt.hash(payload.otp.toString(), 10),
        token:
          payload.token ||
          generateJwt(
            { id: user.id, email: user.email, role: user.role },
            twoFactor.secret,
            "10m",
          ),
        type: payload.type,
        expiredAt: new Date(payload.expiredAt),
        userId,
      },
    });

    return user;
  });

  await sendEmail({
    to: result.email,
    subject: "Resend OTP",
    templateName: emailTemplate(),
    templateData: {
      companyName: envVars.APP_NAME,
      supportEmail: "emdadul2580@gmail.com",
      code: payload.otp,
      expiryMinutes: 10,
      name: result.fullName,
    },
  });

  return true;
};

export const OtpService = { resendOtp };
