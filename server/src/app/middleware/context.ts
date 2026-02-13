import { Request, Response } from "express";
import socketInstance from "../../socket";
import { verifyJwt } from "../utils/jwt";
import { IUserRole } from "../modules/user/user.interface";
import { envVars } from "../config/env";
import { Session } from "../modules/session/session.model";
import User from "../modules/user/user.model";

export const context = async ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}) => {
  const token = req.headers?.authorization || req.cookies?.accessToken;
  let user = null;

  if (token) {
    try {
      const payload = verifyJwt<{
        id: string;
        session_id: string;
        email: string;
        role: IUserRole;
      }>(token, envVars.JWT_ACCESS_TOKEN_SECRET);

      // Check user in DB
      const loggedInUser = await User.findById(payload.id);
      if (!loggedInUser) {
        throw new Error("User not found");
      }

      // Check session in DB
      const session = await Session.findById(payload.session_id);

      if (!session || !session.isActive) {
        throw new Error("Session revoked or expired");
      }

      if (loggedInUser.twoFactor.active && !session.isVerified) {
        throw new Error("Session not verified with 2FA");
      }

      user = {
        id: payload.id as string,
        session_id: payload.session_id as string,
        email: payload.email as string,
        role: payload.role as IUserRole,
      };
    } catch (err: any) {
      console.error("Auth error:", err.message);
    }
  }

  return { req, res, user, io: {} }; // available in every resolver
};
