import mongoose from "mongoose";
import { Message } from "./message.model";
import { QueryBuilder } from "../../lib/queryBuilder";
import Reaction from "../reaction/reaction.model";

const getMessages = async (
  userId: string,
  conversationId: string,
  page: number,
  limit: number,
  search: string,
) => {
  try {
    const builder = new QueryBuilder(Message, {
      conversation: conversationId,
      page: page.toString(),
      limit: limit.toString(),
      search,
    });
    const messages = await builder.filter().sort().paginate().execWithMeta();
    return { messages: messages.data, meta: messages.meta };
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw new Error("Failed to fetch messages");
  }
};

const getMessagById = async (id: mongoose.Types.ObjectId) => {
  try {
    const message = await Message.findById(id);

    return message;
  } catch (error) {
    console.error("Error fetching message:", error);
    throw new Error("Failed to fetch message");
  }
};

const sendMessage = async (
  args: {
    conversationId: string;
    content: string;
    type: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO";
  },
  userId: string,
) => {
  try {
    const message = await Message.create({
      content: args.content,
      type: args.type,
      conversation: args.conversationId,
      sender: userId,
    });
    return message;
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error("Failed to send message");
  }
};

const getReactions = async (target: string) => {
  try {
    const reactions = await Reaction.find({ target, targetType: "Message" });
    return reactions;
  } catch (error) {
    console.error("Error fetching reactions:", error);
    throw new Error("Failed to fetch reactions");
  }
};

export const MessageService = {
  getMessagById,
  getMessages,
  sendMessage,
  getReactions,
};
