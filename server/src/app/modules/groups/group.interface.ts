import { Document, Types } from "mongoose";

export enum GroupType {
  FACEBOOK = "FACEBOOK",
}

export enum GroupPrivacy {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  SECRET = "SECRET",
}

export enum GroupRole {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  MEMBER = "MEMBER",
  PENDING = "PENDING",
  BANNED = "BANNED",
}

export interface IGroup extends Document {
  _id: Types.ObjectId;
  name: string;
  slug?: string;
  description?: string;
  type: GroupType;
  privacy: GroupPrivacy;
  coverPhoto?: { url: string; pub_id?: string };
  createdBy: Types.ObjectId;
  memberCount: number;
  postCount: number;
  settings?: {
    requirePostApproval?: boolean;
    whoCanPost?: "ANY_MEMBER" | "ADMINS_MODS";
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IGroupMembership {
  _id?: Types.ObjectId;
  group: Types.ObjectId;
  user: Types.ObjectId;
  role: GroupRole;
  joinedAt: Date;
  mutedUntil?: Date;
  isBanned?: boolean;
  banReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGroupPostMedia {
  url: string;
  pub_id?: string;
  type?: "IMAGE" | "VIDEO";
  ratio?: string;
}

export interface IGroupPost {
  _id?: Types.ObjectId;
  group: Types.ObjectId;
  author: Types.ObjectId;
  text?: string;
  media?: IGroupPostMedia[];
  createdAt?: Date;
  updatedAt?: Date;
}
