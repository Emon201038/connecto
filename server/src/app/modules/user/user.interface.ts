import { Schema, HydratedDocument, Model, Document } from "mongoose";

export enum IUserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

// Base document fields
export interface IUser extends Document {
  _id: Schema.Types.ObjectId;
  firstName: string;
  lastName?: string;
  fullName: string;
  nickname?: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  profilePicture?: {
    url: string;
    pub_id: string;
  };
  coverPicture?: {
    url: string;
    pub_id: string;
  };
  bio?: string | null;
  followers: Schema.Types.ObjectId[];
  followings: Schema.Types.ObjectId[];
  friends: Schema.Types.ObjectId[];
  friendRequests?: Schema.Types.ObjectId[];
  settings: {
    isPrivate: boolean;
    isVerified: boolean;
    notification: boolean;
    darkMode: boolean;
  };
  twoFactor: {
    active: boolean;
    secret?: string;
  };
  role: IUserRole;
  dateOfBirth: Date;
  isDeleted: boolean;
  deletedAt: Date;
  isDisabled: boolean;
  gender: string;
  createdAt: Date;
  updatedAt: Date;
}

// Instance methods (per document)
export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
}

// Statics (on the model itself)
export interface IUserModel extends Model<IUser, {}, IUserMethods> {
  findByUsername(
    username: string,
  ): Promise<HydratedDocument<IUser, IUserMethods> | null>;
}

// Hydrated document type
export type UserDocument = HydratedDocument<IUser, IUserMethods>;
