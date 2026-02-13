import { IResolverContext } from "../../types/graphql";
import User from "../user/user.model";
import { IMessage } from "./message.interface";
import { MessageService } from "./message.service";

export const messageResolver = {
  Query: {
    messages: async (
      _parent: null,
      args: {
        page: number;
        limit: number;
        search: string;
        conversationId: string;
      },
      context: IResolverContext
    ) => {
      if (!context.user?.id) throw new Error("Unauthorized");
      return await MessageService.getMessages(
        context.user.id,
        args.conversationId,
        args.page,
        args.limit,
        args.search
      );
    },
  },
  Message: {
    sender: async (
      message: IMessage,
      _args: null,
      context: IResolverContext
    ) => {
      if (!context.user?.id) throw new Error("Unauthorized");
      return await User.findById(message.sender);
    },
  },
  Mutation: {
    sendMessage: async (
      _parent: null,
      args: {
        conversationId: string;
        content: string;
        type: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO";
      },
      context: IResolverContext
    ) => {
      if (!context.user?.id) throw new Error("Unauthorized");
      return await MessageService.sendMessage(args, context.user.id);
    },
  },
};
