import { Schema, model } from "mongoose";
import { IConversation, IConversationMember } from "./conversation.interface";

const conversationSchema = new Schema<IConversation>(
  {
    type: { type: String, enum: ["DIRECT", "GROUP"], default: "DIRECT" },
    title: String,
    avatar: String,
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

export const Conversation = model<IConversation>(
  "Conversation",
  conversationSchema
);

const conversationMemberSchema = new Schema<IConversationMember>({
  conversation: {
    type: Schema.Types.ObjectId,
    ref: "Conversation",
    required: [true, "Conversation is required"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required. test"],
  },
  role: { type: String, enum: ["ADMIN", "MEMBER"], default: "MEMBER" },
  nickname: String,
  theme: {
    type: String,
    enum: [
      "LIGHT",
      "DARK",
      "MIDNIGHT",
      "OCEAN",
      "SUNSET",
      "FOREST",
      "PASTEL",
      "ROSE",
      "CYBERPUNK",
      "AUTUMN",
    ],
    default: "LIGHT",
  },
  emoji: {
    type: String,
    default: "LIKE",
  },
  isMuted: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false },
  archived: { type: Boolean, default: false },
  joinedAt: { type: Date, default: Date.now },
  leftAt: Date,
});

export const ConversationMember = model<IConversationMember>(
  "ConversationMember",
  conversationMemberSchema
);
