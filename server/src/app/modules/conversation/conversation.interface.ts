import mongoose, { Document, Schema } from "mongoose";

export interface IConversation extends Document {
  type: "DIRECT" | "GROUP";
  title: string;
  avatar: string;
  lastMessage: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IConversationMember extends Document {
  conversation: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  role: "ADMIN" | "MEMBER";

  nickname: string;
  theme: string;
  emoji: string;
  isMuted: boolean;
  isPinned: boolean;
  archived: boolean;

  joinedAt: Date;
  leftAt: Date;
}
