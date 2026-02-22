import bcrypt from "bcryptjs";
import prisma from "../../../config/db";
import { Response } from "express";
import { generateJwt } from "../../../utils/jwt";
import { envVars } from "../../../config/env";
import { setAuthCookies } from "../../../utils/cookie";

const credentialsLogin = async (
  res: Response,
  userInput: string,
  password: string,
) => {
  if (!userInput || !password) {
    throw new Error("Email or phone number and password is required");
  }
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: userInput }, { phone: userInput }],
      isDeleted: false,
      isDisabled: false,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const accessToken = generateJwt(
    { id: user.id, role: user.role, email: user.email },
    envVars.JWT_ACCESS_TOKEN_SECRET,
    envVars.JWT_ACCESS_TOKEN_EXPIRES_IN,
  );
  const refreshToken = generateJwt(
    { id: user.id, role: user.role, email: user.email },
    envVars.JWT_REFRESH_TOKEN_SECRET,
    envVars.JWT_REFRESH_TOKEN_EXPIRES_IN,
  );

  setAuthCookies(res, { accessToken, refreshToken });

  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      isDeleted: user.isDeleted,
      deletedAt: user.deletedAt,
      isDisabled: user.isDisabled,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    accessToken,
    refreshToken,
  };
};

export const AuthService = { credentialsLogin };
