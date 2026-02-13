import { Schema, model } from "mongoose";
import { ISession } from "./session.interface";

const SessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    deviceInfo: {
      os: String,
      browser: String,
      deviceType: String,
      userAgent: String,
    },
    ipAddress: String,
    location: {
      country: String,
      city: String,
      lat: Number,
      lon: Number,
    },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false }, // 2FA passed
    trustedDevice: { type: Boolean, default: false }, // remember this device
    lastUsedAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "lastUsedAt" } }
);

export const Session = model<ISession>("Session", SessionSchema);
