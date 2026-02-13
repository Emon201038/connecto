import { Document, Types } from "mongoose";
import { ReadStream } from "fs";

export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => ReadStream;
}

export interface CloudinaryUpload {
  url: string;
  pub_id: string;
}

export enum PostType {
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
  LINK = "link",
}

export enum PostPrivacy {
  PUBLIC = "PUBLIC",
  FRIENDS = "FRIENDS",
  ONLY_ME = "ONLY_ME",
}

export interface IPostFeelings {
  type: string;
  emoji: string;
  text: string;
}

export interface IPost extends Document {
  type: PostType;
  content: string;
  author: Types.ObjectId;
  group: Types.ObjectId;
  attachments?: {
    url: string;
    pub_id: string;
  }[];
  privacy: PostPrivacy;
  entities: IEntity[];
  share: Types.ObjectId[];
  feelings?: IPostFeelings;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface IEntity {
  offset: number;
  end: number;
  type: string;
  target: Types.ObjectId;
  text: string;
  model: "User" | "Hashtag";
}
