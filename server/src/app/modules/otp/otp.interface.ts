import { Document } from "mongoose";

export enum OtpType {
  TWO_FACTOR = "two_factor",
  RESET_PASS = "reset_pass",
  ACCOUNT_VERIFY = "account_verify",
}
export interface IOtp extends Document {
  code: number;
  type: OtpType;
  email: string;
  iat: Date;
  expat: Date;
  isUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
