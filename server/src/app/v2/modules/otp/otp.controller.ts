import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { OtpService } from "./otp.service";

const resendOtp = catchAsync(async (req, res, next) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Otp resent successfully",
    data: await OtpService.resendOtp(req.body, req.body.userId),
  });
});

export const OtpController = { resendOtp };
