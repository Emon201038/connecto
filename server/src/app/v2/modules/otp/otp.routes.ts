import express from "express";
import { OtpController } from "./otp.controller";

const otpRoutes = express.Router();

otpRoutes.post("/resend", OtpController.resendOtp);

export default otpRoutes;
