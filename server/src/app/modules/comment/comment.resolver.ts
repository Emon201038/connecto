import { context } from "./../../middleware/context";
import { IResolverContext } from "../../types/graphql";
import { CommentService } from "./comment.service";
import { IComment } from "./comment.interface";
import User from "../user/user.model";
import Comment from "./comment.model";
import Reaction from "../reaction/reaction.model";
import Post from "../post/post.model";

export const commentResolver = {
  Query: {
    comments: async (
      parent: null,
      arg: Record<string, string>,
      context: IResolverContext
    ) => {
      const res = await CommentService.getAllComments(arg);
      return { comments: res.data, meta: res.meta };
    },
  },
  Comment: {
    post: async (parent: IComment) => {
      const post = await Post.findById(parent.post);
      return post;
    },
    parent: async (parent: IComment) => {
      const comment = await Comment.findById(parent.parent);
      return comment;
    },
    author: async (parent: IComment) => {
      const user = await User.findById(parent.author);
      return user;
    },
    replyCount: async (parent: IComment) => {
      return await Comment.countDocuments({ parent: parent._id });
    },
    reactionCount: async (parent: IComment) => {
      const count = await Reaction.countDocuments({
        target: parent._id,
        targetType: "Comment",
      });
      return count;
    },
    reactionSummary: async (parent: IComment) => {
      const summary = await Reaction.aggregate([
        { $match: { target: parent._id, targetType: "Comment" } },
        { $group: { _id: "$type", count: { $sum: 1 } } },
      ]);
      return summary.map((r) => ({ ...r, reactionType: r._id }));
    },
    myReaction: async (
      parent: IComment,
      _: unknown,
      context: IResolverContext
    ) => {
      if (!context.user?.id) return null;
      return Reaction.findOne({
        target: parent._id,
        targetType: "Comment",
        user: context.user.id,
      });
    },
  },
  Mutation: {
    createComment: async (
      parent: null,
      input: any,
      context: IResolverContext
    ) => {
      const { user } = context;
      if (!user) {
        throw new Error("Unauthorized");
      }

      return await CommentService.createComment(user.id, input);
    },
  },
};
