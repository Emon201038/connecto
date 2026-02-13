import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 5050;
export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || "this_is_super_secret_token";
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET || "this_is_super_secret_token";
export const DATABASE_URL = process.env.DATABASE_URL as string;