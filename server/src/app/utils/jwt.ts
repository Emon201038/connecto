import jwt, { SignOptions } from "jsonwebtoken";
import { IUserRole } from "../modules/user/user.interface";

export const signJwt = (
  payload: { id: string; session_id: string; role: IUserRole; email: string },
  secret: string,
  expiresIn: SignOptions["expiresIn"]
) => jwt.sign(payload, secret, { expiresIn });

export const verifyJwt = <T>(token: string, secret: string) =>
  jwt.verify(token, secret) as T;
