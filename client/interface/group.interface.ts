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

export interface IGroup {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  type: GroupType;
  privacy: GroupPrivacy;
  coverPhoto?: { url: string; pub_id?: string };
  createdBy: string;
  memberCount: number;
  postCount: number;
  settings?: {
    requirePostApproval?: boolean;
    whoCanPost?: "ANY_MEMBER" | "ADMINS_MODS";
  };
  createdAt: Date;
  updatedAt: Date;
  joined: boolean;
}

export interface IGroupMembership {
  id?: string;
  group: string;
  user: string;
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
  id?: string;
  group: string;
  author: string;
  text?: string;
  media?: IGroupPostMedia[];
  createdAt?: Date;
  updatedAt?: Date;
}
