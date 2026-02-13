import { Document, Types } from "mongoose";

export enum ReactionType {
  LIKE = "LIKE",
  LOVE = "LOVE",
  CARE = "CARE",
  HAHA = "HAHA",
  WOW = "WOW",
  SAD = "SAD",
  ANGRY = "ANGRY",
}

export enum ReactionTargetType {
  POST = "Post",
  COMMENT = "Comment",
  MESSAGE = "Message",
}

export interface IReaction extends Document {
  user: Types.ObjectId;
  target: Types.ObjectId;
  type: ReactionType;
  targetType: ReactionTargetType;
  createdAt: Date;
  updatedAt: Date;
}
