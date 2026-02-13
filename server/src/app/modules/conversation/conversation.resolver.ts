import { Schema, Types } from "mongoose";
import { IResolverContext } from "../../types/graphql";
import { MessageService } from "../message/message.service";
import { IConversation, IConversationMember } from "./conversation.interface";
import { ConversationService } from "./conversation.service";
import { ConversationMember } from "./conversation.model";
import User from "../user/user.model";
import { Message } from "../message/message.model";

export const conversationResolver = {
  Query: {
    myConversations: async (
      _parent: null,
      args: { page: number; limit: number; search: string },
      context: IResolverContext,
    ) => {
      if (!context.user?.id) throw new Error("Unauthorized");
      return await ConversationService.getMyConversations(
        context.user.id,
        args.page,
        args.limit,
        args.search,
      );
    },
    conversationInfo: async (
      _parent: null,
      args: { id: string },
      context: IResolverContext,
    ) => {
      if (!context.user?.id) throw new Error("Unauthorized");
      return await ConversationService.getConversationInfo(
        args.id,
        context.user.id,
      );
    },
  },
  Conversation: {
    lastMessage: async (parent: IConversation) => {
      const message = await Message.findOne({ conversation: parent._id }).sort({
        createdAt: -1,
      });
      return message;
    },
    members: async (parent: IConversation) => {
      return await ConversationMember.find({ conversation: parent._id });
    },
    avatar: async (
      parent: IConversation,
      _args: null,
      context: IResolverContext,
    ) => {
      if (parent.type === "GROUP") return parent.avatar;
      const conversationUsers = await ConversationMember.find({
        conversation: parent._id,
      }).select("user");
      const user = await User.findOne({
        _id: conversationUsers.filter(
          (u) => u.user.toString() !== context.user?.id,
        )[0].user,
      }).select("profilePicture");
      return user?.profilePicture?.url;
    },
    title: async (
      parent: IConversation,
      _args: null,
      context: IResolverContext,
    ) => {
      if (parent.type === "GROUP") return parent.title;
      const conversationUser = await ConversationMember.findOne({
        conversation: parent._id,
        user: { $ne: context.user?.id },
      }).select("user nickname");

      if (!conversationUser) return "";

      if (conversationUser.nickname) return conversationUser.nickname;
      const user = await User.findOne({
        _id: conversationUser.user,
      }).select("fullName");
      return user?.fullName;
    },
    unreadCount: async (
      parent: IConversation,
      _args: null,
      context: IResolverContext,
    ) => {
      if (!context.user?.id) throw new Error("Unauthorized");
      return await ConversationService.getUnreadCount(
        parent._id as string,
        context.user.id,
      );
    },
  },
  ConversationMember: {
    user: async (parent: IConversationMember) => {
      return await User.findById(parent.user);
    },
    nickname: async (
      parent: IConversationMember,
      _args: null,
      context: IResolverContext,
    ) => {
      if (!context.user?.id) throw new Error("Unauthorized");
      if (parent.nickname) return parent.nickname;

      const conversationUser = await User.findById(parent.user).select(
        "fullName",
      );
      return conversationUser?.fullName;
    },
  },
  ConversationInfo: {
    lastMessage: async (parent: {
      id: Types.ObjectId;
      hasConversation: boolean;
      lastMessage: Types.ObjectId;
    }) => {
      const message = await Message.findOne({
        conversation: parent.lastMessage,
      }).sort();
      if (message) return message;
      return null;
    },
  },
  Mutation: {
    createDirectConversation: async (
      _parent: null,
      args: { participantId: string },
      context: IResolverContext,
    ) => {
      if (!context.user?.id) throw new Error("Unauthorized");
      const res = await ConversationService.createDirectConversation(
        context.user.id,
        args.participantId,
      );
      return res;
    },

    createGroupConversation: async (
      _parent: null,
      args: { title: string; participantIds: Schema.Types.ObjectId[] },
      context: IResolverContext,
    ) => {
      if (!context.user?.id) throw new Error("Unauthorized");
      return await ConversationService.createGroupConversation(
        args,
        context.user.id,
      );
    },

    updateEmoji: async (
      _parent: null,
      args: { id: string; emoji: string },
      context: IResolverContext,
    ) => {
      if (!context.user?.id) throw new Error("Unauthorized");
      return await ConversationService.updateEmoji(args, context.user.id);
    },
  },
};
