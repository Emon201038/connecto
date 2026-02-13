import { model, Schema } from "mongoose";
import { IOtp, OtpType } from "./otp.interface";

const otpSchema = new Schema<IOtp>(
  {
    code: {
      type: Number,
      required: [true, "Otp is required"],
    },
    type: {
      type: String,
      enum: Object.values(OtpType),
      required: [true, "otp type is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      lowercase: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    iat: {
      type: Date,
      required: [true, "issue date is required"],
    },
    expat: {
      type: Date,
      required: [true, "expire date is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Otp = model<IOtp>("Otp", otpSchema);
export default Otp;
