import { IResolverContext } from "../../types/graphql";
import Post from "./post.model";
import { PostService } from "./post.service";
import User from "../user/user.model";
import Comment from "../comment/comment.model";
import Reaction from "../reaction/reaction.model";
import { IEntity, IPost, PostType } from "./post.interface";
import Hashtag from "../hashtag/hashtag.model";
import mongoose, { ObjectId } from "mongoose";
import { ReactionType } from "../reaction/reaction.interface";
import { Group } from "../groups/group.model";

export const postResolvers = {
  Query: {
    getPost: async (
      _: unknown,
      { id }: { id: string },
      context: IResolverContext
    ) => {
      return Post.findById(id);
    },
    posts: async (
      _: unknown,
      {
        page = 1,
        limit = 10,
        search,
        author,
        username,
      }: {
        page: number;
        limit: number;
        search: string;
        author: string;
        username: string;
      },
      context: IResolverContext
    ) => {
      const data = await PostService.getAllPosts({
        page: page.toString(),
        limit: limit.toString(),
        search,
        author,
        username,
      });
      return data;
    },
    // usersPosts: async (
    //   _: unknown,
    //   {
    //     page = 1,
    //     limit = 10,
    //     search,
    //     author,
    //   }: { page: number; limit: number; search: string; author: string },
    //   context: IResolverContext
    // ) => {
    //   const data = await PostService.getUsersPosts({
    //     page: page.toString(),
    //     limit: limit.toString(),
    //     search,
    //     author,
    //   });
    //   return data;
    // }
  },
  Post: {
    author: async (
      parent: { author: string },
      _: unknown,
      context: IResolverContext
    ) => {
      return User.findById(parent.author);
    },
    comments: async (
      parent: { id: string },
      _: unknown,
      context: IResolverContext
    ) => {
      const comments = await Comment.find({ post: parent.id });
      return comments;
    },
    entities: async (parent: IPost, _: unknown, context: IResolverContext) => {
      return parent.entities;
    },
    tags: async (
      parent: { tags: string[] },
      _: unknown,
      context: IResolverContext
    ) => {
      if (!parent.tags || parent.tags.length === 0) return [];
      return User.find({
        _id: {
          $in: parent.tags,
        },
      });
    },
    reactionCount: async (
      parent: { _id: ObjectId },
      _: unknown,
      context: IResolverContext
    ) => {
      const reactions = await Reaction.find({
        target: parent._id,
        targetType: "POST",
      }).countDocuments();
      return reactions;
    },
    myReaction: async (
      parent: { _id: string },
      _: unknown,
      context: IResolverContext
    ) => {
      if (!context.user?.id) return null;
      return Reaction.findOne({
        target: parent._id,
        targetType: "Post",
        user: context.user.id,
      });
    },
    reactionSummary: async (
      parent: { _id: string },
      _args: unknown,
      ctx: IResolverContext
    ) => {
      const all = await Reaction.aggregate<{
        _id: ReactionType;
        count: number;
      }>([
        {
          $match: {
            target: new mongoose.Types.ObjectId(parent._id),
            targetType: "Post",
          },
        },
        { $group: { _id: "$type", count: { $sum: 1 } } },
      ]);

      return all.map((r) => ({ ...r, reactionType: r._id }));
    },
    commentCount: async (
      parent: { id: string },
      _: unknown,
      context: IResolverContext
    ) => {
      const comments = await Comment.countDocuments({ post: parent.id });
      return comments;
    },
    shareCount: async (
      parent: IPost,
      _: unknown,
      context: IResolverContext
    ) => {
      return parent?.share?.length;
    },
    share: async (parent: IPost, _: unknown, context: IResolverContext) => {
      const res = parent?.share.map(async (id) => {
        const user = await User.findById(parent?.id);
        return user;
      });

      return await Promise.all(res);
    },
    group: async (parent: IPost, _: unknown, context: IResolverContext) => {
      return Group.findById(parent.group);
    },
  },

  Entity: {
    target: async (parent: IEntity, _: unknown, context: IResolverContext) => {
      if (parent.model === "User") {
        return User.findById(parent.target);
      }
      if (parent.model === "Hashtag") {
        return Hashtag.findById(parent.target);
      }
    },
  },

  EntityTarget: {
    __resolveType(obj: any) {
      if (obj.fullName) return "User"; // User has fullName field
      if (obj.tag) return "Hashtag"; // Hashtag has tag field
      return null;
    },
  },

  Mutation: {
    createPost: async (
      _: unknown,
      { input }: { input: Partial<IPost> },
      context: IResolverContext
    ) => {
      if (!context.user?.id) {
        throw new Error("Unauthorized");
      }

      const post = await PostService.createPost(input, context.user.id);
      return post;
    },

    deletePost: async (
      _: unknown,
      { id }: { id: string },
      context: IResolverContext
    ) => {
      const res = await Post.findOneAndUpdate({ _id: id }, { isDeleted: true });
      return res ? true : false;
    },
  },
};
