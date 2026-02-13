import { Request, Response } from "express";
import User from "../user/user.model";
import { envVars } from "../../config/env";
import { signJwt } from "../../utils/jwt";
import { SignOptions } from "jsonwebtoken";
import { GraphQLError } from "graphql";
import { IUser } from "../user/user.interface";
import { parseUserAgent } from "../../utils/device";
import { parseGeoIP } from "../../utils/geo";
import { Session } from "../session/session.model";
import { OtpService } from "../otp/otp.service";
import { OtpType } from "../otp/otp.interface";
import { IResolverContext } from "../../types/graphql";
import { MongooseError } from "mongoose";
import { handleMongooseError } from "./auth.helper";
import { late } from "zod/v3";

const login = async (
  req: Request,
  res: Response,
  payload: { email: string; password: string },
) => {
  const { email, password } = payload;
  const users = await User.find({ $or: [{ email }, { phone: email }] });
  let user: IUser | null = null;
  for (let i = 0; i < users.length; i++) {
    const element = users[i];
    if (await element.comparePassword(password)) {
      user = element;
    } else {
      user = null;
    }
  }
  if (!user) throw new Error("Invalid credentials");

  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    (req.socket.remoteAddress as string);
  const ua = req.headers["user-agent"] || "Unknown";

  const deviceInfo = parseUserAgent(ua);
  const location = parseGeoIP(ip);

  // Check if trusted
  const trusted = await Session.findOne({
    userId: user._id,
    "deviceInfo.userAgent": ua,
    trustedDevice: true,
    isActive: true,
  });

  const session = await Session.create({
    userId: user._id,
    deviceInfo,
    ipAddress: ip,
    location,
    isVerified: !!trusted,
    trustedDevice: !!trusted,
  });

  if (trusted || !user.twoFactor.active) {
    session.isVerified = true;
    session.isActive = true;
    await session.save();
    const accessToken = signJwt(
      {
        id: user._id.toString(),
        session_id: session._id.toString(),
        role: user.role,
        email: user.email,
      },
      envVars.JWT_ACCESS_TOKEN_SECRET,
      envVars.JWT_ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
    );
    const refreshToken = signJwt(
      {
        id: user._id.toString(),
        session_id: session._id.toString(),
        email: user.email,
        role: user.role,
      },
      envVars.JWT_REFRESH_TOKEN_SECRET,
      "7d",
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return {
      requires2FA: false,
      message: "Logged in successfully",
      s_id: null,
      o_id: null,
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        phone: user.phone,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        username: user.username,
        profilePicture: user.profilePicture,
      },
    };
  }

  const otpDoc = await OtpService.sendOtp(
    OtpType.TWO_FACTOR,
    user.email,
    6,
    10 * 60 * 1000,
  );

  return {
    requires2FA: true,
    s_id: session._id,
    o_id: otpDoc._id,
    message: "2FA required",
    accessToken: null,
    refreshToken: null,
  };
};

const saveLogin = async (user: IResolverContext["user"], sessionId: string) => {
  if (!user) throw new GraphQLError("User not found");
  const session = await Session.findById(sessionId);
  if (!session) throw new GraphQLError("Session not found");

  const userDoc = await User.findById(session.userId);
  if (!userDoc) throw new GraphQLError("User not found");

  session.lastUsedAt = new Date();
  session.trustedDevice = true;
  await userDoc.save();
  return true;
};

const me = async (userId: string, sessionId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new GraphQLError("No user found");

  const session = await Session.findById(sessionId);
  if (!session)
    throw new GraphQLError("Your session has expired. Please login again.");

  if (!session.isActive || !session.isVerified)
    throw new GraphQLError("Your session has expired. Please login again.");

  return user;
};

const logout = async (context: IResolverContext) => {
  try {
    const { req, res } = context;

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return true;
  } catch (error) {
    throw error;
  }
};

const setCookie = async (args: {
  accessToken: string;
  refreshToken: string;
  res: Response;
}) => {
  try {
    const { accessToken, refreshToken, res } = args;
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return true;
  } catch (error) {
    throw error;
  }
};

export const AuthServices = {
  login,
  saveLogin,
  me,
  logout,
  setCookie,
};
