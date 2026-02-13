import { Types } from "mongoose";

export interface ISession {
  userId: Types.ObjectId;
  deviceInfo: {
    os: string;
    browser: string;
    deviceType: string;
    userAgent: string;
  };
  ipAddress: string;
  location: {
    country: string;
    city: string;
    lat: number;
    lon: number;
  };
  isActive: boolean;
  isVerified: boolean; // 2FA passed
  trustedDevice: boolean; // remember this device
  lastUsedAt: Date;
}
