import dotenv from "dotenv";

dotenv.config();

interface IEnvVars {
  PORT: string;
  APP_NAME: string;
  DB_URI: string;
  NODE_ENV: "development" | "production";
  JWT_ACCESS_TOKEN_SECRET: string;
  JWT_ACCESS_TOKEN_EXPIRES_IN: string;
  JWT_REFRESH_TOKEN_SECRET: string;
  JWT_REFRESH_TOKEN_EXPIRES_IN: string;
  JWT_RESET_PASSWORD_TOKEN_SECRET: string;
  JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN: string;
  CLIENT_URL: string;
  SALT_ROUNDS: string;
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_USER: string;
  SMTP_FROM: string;
  SMTP_PASSWORD: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  CLOUDINARY_CLOUD_NAME: string;
}

const loadEnv = (): IEnvVars => {
  const requiredEnv = [
    "PORT",
    "APP_NAME",
    "DB_URI",
    "NODE_ENV",
    "JWT_ACCESS_TOKEN_SECRET",
    "JWT_ACCESS_TOKEN_EXPIRES_IN",
    "JWT_REFRESH_TOKEN_SECRET",
    "JWT_REFRESH_TOKEN_EXPIRES_IN",
    "JWT_RESET_PASSWORD_TOKEN_SECRET",
    "JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN",
    "CLIENT_URL",
    "SALT_ROUNDS",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_FROM",
    "SMTP_PASSWORD",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "CLOUDINARY_CLOUD_NAME",
  ];

  requiredEnv.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`Missing environment variable: ${envVar}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    APP_NAME: process.env.APP_NAME as string,
    DB_URI: process.env.DB_URI as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET as string,
    JWT_ACCESS_TOKEN_EXPIRES_IN: process.env
      .JWT_ACCESS_TOKEN_EXPIRES_IN as string,
    JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET as string,
    JWT_REFRESH_TOKEN_EXPIRES_IN: process.env
      .JWT_REFRESH_TOKEN_EXPIRES_IN as string,
    JWT_RESET_PASSWORD_TOKEN_SECRET: process.env
      .JWT_RESET_PASSWORD_TOKEN_SECRET as string,
    JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN: process.env
      .JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN as string,
    CLIENT_URL: process.env.CLIENT_URL as string,
    SALT_ROUNDS: process.env.SALT_ROUNDS as string,
    SMTP_HOST: process.env.SMTP_HOST as string,
    SMTP_PORT: process.env.SMTP_PORT as string,
    SMTP_USER: process.env.SMTP_USER as string,
    SMTP_FROM: process.env.SMTP_FROM as string,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD as string,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
  };
};

export const envVars = loadEnv();
