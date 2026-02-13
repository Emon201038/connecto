import { Document, Types } from "mongoose";

export interface IHashtag extends Document {
  tag: string;
  usageCount: number;
  createdAt: Date;
  createdBy: Types.ObjectId;
}
