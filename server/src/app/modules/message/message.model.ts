import { Schema, model } from "mongoose";
import { IMessage, IMessageStatus, IMessageType } from "./message.interface";

const messageSchema = new Schema<IMessage>(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: String,
    attachments: [{ type: Schema.Types.ObjectId, ref: "Attachment" }],
    replyTo: { type: Schema.Types.ObjectId, ref: "Message" },
    deletedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    type: {
      type: String,
      enum: Object.values(IMessageType),
      default: IMessageType.TEXT,
    },
  },
  {
    timestamps: true,
  }
);

export const Message = model<IMessage>("Message", messageSchema);

const messageStatusSchema = new Schema<IMessageStatus>(
  {
    message: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: [true, "Message id is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
    },
    status: {
      type: String,
      enum: ["SENT", "DELIVERED", "SEEN"],
      required: [true, "Status is required"],
    },
    seenBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    seenAt: Date,
  },
  { timestamps: true }
);

export const MessageStatus = model<IMessageStatus>(
  "MessageStatus",
  messageStatusSchema
);
