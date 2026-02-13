import { GraphQLError } from "graphql";
import { OtpType } from "./otp.interface";
import Otp from "./otp.model";
import { Session } from "../session/session.model";

const sendOtp = async (
  type: OtpType,
  email: string,
  digit = 6,
  expiredAt = 10 * 60 * 1000
) => {
  try {
    const code = Math.floor(
      10 ** (digit - 1) + Math.random() * 9 * 10 ** (digit - 1)
    );
    const now = new Date();
    const existingOtp = await Otp.findOne({
      email,
      type,
      isUsed: false,
    });
    if (existingOtp && existingOtp.expat > now) {
      return existingOtp;
    }
    const otpDoc = await Otp.create({
      email,
      type,
      iat: now,
      expat: new Date(now.getTime() + expiredAt),
      code,
    });

    return otpDoc;
  } catch (error) {
    throw error;
  }
};

const verifyOtp = async (sessionId: string, otpId: string, token: string) => {
  const session = await Session.findById(sessionId).populate("userId");
  if (!session) throw new GraphQLError("Otp is not matched");

  const otp = await Otp.findById(otpId);
  if (!otp) {
    throw new GraphQLError("Otp is not matched");
  }

  if (otp.expat < new Date()) {
    throw new GraphQLError("OTP is expired");
  }

  if (otp.isUsed) {
    throw new GraphQLError(
      "This otp is used previously. Please enter newly send otp"
    );
  }

  const verified = otp.code === Number(token);

  if (!verified) throw new GraphQLError("Invalid code");

  session.isVerified = true;

  otp.isUsed = true;

  await otp.save({ validateBeforeSave: true });
  await session.save({ validateBeforeSave: true });

  return session;
};

export const OtpService = {
  sendOtp,
  verifyOtp,
};
