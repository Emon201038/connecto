import { catchAsync } from "../../../middleware/catchAsync";
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

export const AuthController = { login };
