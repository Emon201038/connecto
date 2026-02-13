import { Document, Types } from "mongoose";

export interface IMessage extends Document {
  conversation: Types.ObjectId;
  sender: Types.ObjectId;
  replyTo?: Types.ObjectId;
  content: string;
  attachments: Types.ObjectId[];
  deletedBy: Types.ObjectId[];
  type: IMessageType;
  createdAt: Date;
  updatedAt: Date;
}

export enum IMessageType {
  EMOJI = "EMOJI",
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  FILE = "FILE",
}

export interface IMessageStatus extends Document {
  message: Types.ObjectId;
  user: Types.ObjectId;
  status: "SENT" | "DELIVERED" | "SEEN";
  seenAt?: Date;
  seenBy?: Types.ObjectId[];
}
