import jwt, { SignOptions, JwtPayload as JWTPayload } from "jsonwebtoken";
import { IUserRole } from "../modules/user/user.interface";

export const signJwt = (
  payload: { id: string; session_id: string; role: IUserRole; email: string },
  secret: string,
  expiresIn: SignOptions["expiresIn"],
) => jwt.sign(payload, secret, { expiresIn });

export const verifyJwt = <T>(token: string, secret: string) =>
  jwt.verify(token, secret) as T;

export interface JwtPayload extends JWTPayload {
  id: string;
  role: string;
  email: string;
  iat?: number;
  exp?: number;
}

export const generateJwt = (
  payload: JwtPayload,
  secret: string,
  expiresIn?: string,
) =>
  jwt.sign(payload, secret, {
    expiresIn,
  } as SignOptions);
