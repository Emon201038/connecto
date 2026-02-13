import { IResolverContext } from "../../types/graphql";
import { ReactionService } from "./reaction.service";
import { Types } from "mongoose";
import User from "../user/user.model";
import { ReactionType } from "./reaction.interface";

export const reactionResolver = {
  Query: {
    getReactions: async (
      parent: null,
      args: { target: string; type?: ReactionType }
    ) => {
      return await ReactionService.getReactions(args.target, args.type);
    },
  },
  Mutation: {
    toggleReaction: async (
      parent: null,
      args: Record<string, string>,
      context: IResolverContext
    ) => {
      const { user } = context;
      if (!user) throw new Error("Unauthorized");
      return await ReactionService.toggleReaction(user.id, args);
    },
  },
  React: {
    user: async (parent: { user: Types.ObjectId }) =>
      await User.findById(parent.user),
  },
};
