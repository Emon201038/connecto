import { Document, Types } from "mongoose";

export interface IStory extends Document {
  user: Types.ObjectId;
  mediaUrl: String;
  expiresAt: Date;
  viewers: Types.ObjectId[];
  reactions: Types.ObjectId[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
