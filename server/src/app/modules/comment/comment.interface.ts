import { Document, Types } from "mongoose";
import { IEntity } from "../post/post.interface";

export interface IComment extends Document {
  _id: Types.ObjectId;
  text: string;
  parent: Types.ObjectId | null;
  post: Types.ObjectId;
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  entities: IEntity[];
}
