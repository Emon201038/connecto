import { GraphQLError } from "graphql";
import { IResolverContext } from "../../types/graphql";
import User from "../user/user.model";
import { Session } from "../session/session.model";
import { OtpService } from "./otp.service";
import { OtpType } from "./otp.interface";
import { IUser } from "../user/user.interface";
import { signJwt } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { SignOptions } from "jsonwebtoken";
import Otp from "./otp.model";
import { sendEmail } from "../../utils/sendEmail";

export const otpResolver = {
  Mutation: {
    sendOtp: async (
      parent: null,
      { s_id, type }: { s_id: string; type: OtpType },
      { user }: IResolverContext
    ) => {
      const session = await Session.findById(s_id);
      if (!session) throw new GraphQLError("Session not found");

      const userDoc = await User.findById(session.userId);
      if (!userDoc) throw new GraphQLError("User not found");

      const otp = await OtpService.sendOtp(
        type,
        userDoc.email,
        6,
        10 * 60 * 1000
      );

      return {
        s_id: session._id,
        o_id: otp._id,
      };
    },
    sendResetCode: async (
      parent: null,
      { email, id }: { email: string; id: string },
      { user }: IResolverContext
    ) => {
      const userInfo = await User.findById(id);
      if (!userInfo) throw new GraphQLError("User not found");
      const res = await OtpService.sendOtp(OtpType.RESET_PASS, email, 6);

      const now = new Date();
      const exp = new Date(res.expat);

      const diffMs = exp.getTime() - now.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));

      sendEmail({
        to: email,
        subject: "Reset Password",
        templateName: "reset-password",
        templateData: {
          code: res.code,
          id: id,
          companyName: envVars.APP_NAME,
          name: userInfo.fullName,
          expiryMinutes: diffMinutes,
          resetUrl: `${envVars.CLIENT_URL}/recover/code?method=email-code&o_id=${res._id}`,
          supportEmail: "emdadul2580@gmail.com",
        },
      });
      return res._id;
    },
    verify2FA: async (
      parent: null,
      { s_id, o_id, token }: { s_id: string; o_id: string; token: string },
      { res }: IResolverContext
    ) => {
      const session = await OtpService.verifyOtp(s_id, o_id, token);

      const accessToken = signJwt(
        {
          id: session.userId._id.toString(),
          session_id: s_id,
          role: (session.userId as unknown as IUser).role,
          email: (session.userId as unknown as IUser).email,
        },
        envVars.JWT_ACCESS_TOKEN_SECRET,
        envVars.JWT_ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"]
      );
      const refreshToken = signJwt(
        {
          id: (session.userId as unknown as IUser)._id.toString(),
          email: (session.userId as unknown as IUser).email,
          role: (session.userId as unknown as IUser).role,
          session_id: s_id,
        },
        envVars.JWT_REFRESH_TOKEN_SECRET,
        envVars.JWT_REFRESH_TOKEN_EXPIRES_IN as SignOptions["expiresIn"]
      );

      res.cookie("accessToken", accessToken, { httpOnly: true });
      res.cookie("refreshToken", refreshToken, { httpOnly: true });

      return true;
    },
  },
};
