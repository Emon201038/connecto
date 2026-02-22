import { catchAsync } from "../../../middleware/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";

const login = catchAsync(async (req, res, next) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User logged in successfully",
    data: {},
  });
});

export const AuthController = { login };
