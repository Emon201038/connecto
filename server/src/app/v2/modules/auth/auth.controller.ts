import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { AuthService } from "./auth.service";

const login = catchAsync(async (req, res, next) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User logged in successfully",
    data: await AuthService.credentialsLogin(
      res,
      req.body.email,
      req.body.password,
    ),
  });
});

const refreshToken = catchAsync(async (req, res, next) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User logged in successfully",
    data: await AuthService.refreshToken(
      res,
      (req.cookies.refreshToken ||
        req.headers.authorization ||
        req.headers["x-access-token"]) as string,
    ),
  });
});

export const AuthController = { login, refreshToken };
