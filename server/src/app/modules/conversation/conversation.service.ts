import { Schema } from "mongoose";
import { QueryBuilder } from "../../lib/queryBuilder";
import { Conversation, ConversationMember } from "./conversation.model";
import { Types } from "mongoose";
import { Message } from "../message/message.model";

const getMyConversations = async (
  userId: string,
  page: number,
  limit: number,
  search: string,
) => {
  try {
    const builder = new QueryBuilder(ConversationMember, {
      user: userId,
      page: page.toString(),
      limit: limit.toString(),
      search,
    });
    const conversations = await builder
      .filter()
      .sort()
      .paginate()
      .select(["_id", "conversation"])
      .execWithMeta();

    return {
      conversations: await Conversation.find({
        _id: { $in: conversations.data.map((c) => c.conversation) },
      }),
      meta: conversations.meta,
    };
  } catch (error) {
    throw error;
  }
};

const createDirectConversation = async (
  userId: string,
  participantId: string,
) => {
  try {
    // Check if a conversation already exists between the two users
    const existingMemberships = await ConversationMember.find({
      user: { $in: [userId, participantId] },
    }).populate("conversation");

    const existing = existingMemberships.find((m1) =>
      existingMemberships.some(
        (m2) =>
          m1.conversation.equals(m2.conversation) &&
          m1.user.toString() !== m2.user.toString(),
      ),
    );

    if (existing) return existing.conversation;

    // Otherwise create new conversation
    const conversation = await Conversation.create({ type: "DIRECT" });

    await ConversationMember.insertMany([
      { conversation: conversation._id, user: userId },
      { conversation: conversation._id, user: participantId },
    ]);

    return conversation;
  } catch (error) {
    throw error;
  }
};

const createGroupConversation = async (
  args: { title: string; participantIds: Schema.Types.ObjectId[] },
  userId: string,
) => {
  try {
    const conversation = await Conversation.create({
      type: "GROUP",
      title: args.title,
    });

    await ConversationMember.create([
      { conversationId: conversation._id, userId, role: "ADMIN" },
      ...args.participantIds.map((id) => ({
        conversationId: conversation._id,
        userId: id,
        role: "MEMBER",
      })),
    ]);

    return conversation;
  } catch (error) {
    throw error;
  }
};

const getUnreadCount = async (conversationId: string, userId: string) => {
  try {
    const count = await Message.aggregate<{ count: number }>([
      {
        $match: {
          conversation: new Types.ObjectId(conversationId),
          seenBy: { $ne: userId },
        },
      },
      {
        $group: {
          _id: "$conversation",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          count: 1,
        },
      },
    ]);
    return count[0]?.count || 0;
  } catch (error) {
    throw error;
  }
};

const getConversationInfo = async (conversationId: string, userId: string) => {
  try {
    return await ConversationMember.findOne({
      conversation: conversationId,
      user: { $ne: userId },
    });
  } catch (error) {
    throw error;
  }
};

const updateEmoji = async (
  args: { id: string; emoji: string },
  userId: string,
) => {
  try {
    const res = await ConversationMember.findOneAndUpdate(
      { conversation: args.id, user: { $ne: userId } },
      {
        emoji: args.emoji,
      },
      {
        new: true,
        runValidators: true,
        context: "query",
      },
    );
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const ConversationService = {
  getMyConversations,
  createDirectConversation,
  createGroupConversation,
  getUnreadCount,
  getConversationInfo,
  updateEmoji,
};
