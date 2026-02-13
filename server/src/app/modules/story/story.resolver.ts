import { Upload } from "graphql-upload-ts";
import { IResolverContext } from "../../types/graphql";
import { uploadFilesToCloudinary } from "../../utils/upload-files";
import Story from "./story.model";
import { IStory } from "./story.interface";
import User from "../user/user.model";
export const storyResolver = {
  Query: {
    stories: async (
      _parent: null,
      args: { page: number; limit: number },
      context: IResolverContext
    ) => {
      const { page, limit } = args;
      const now = new Date();

      if (!context?.user?.id) throw new Error("Unauthorized");

      const totalUsers = await Story.aggregate([
        {
          $match: {
            isDeleted: false,
            expiresAt: { $gte: now },
          },
        },
        {
          $group: { _id: "$user" },
        },
        {
          $count: "total",
        },
      ]);

      const total = totalUsers[0]?.total || 0;
      const totalPages = Math.ceil(total / limit);

      const stories = await Story.aggregate<{ _id: string; stories: IStory[] }>(
        [
          {
            $match: {
              isDeleted: false,
              expiresAt: { $gte: now },
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $group: {
              _id: "$user",
              stories: { $push: "$$ROOT" },
            },
          },
          {
            $sort: { _id: 1 }, // ensure stable pagination
          },
          {
            $skip: (page - 1) * limit,
          },
          {
            $limit: limit,
          },
        ]
      );

      // 3️⃣ Move viewer's own stories to the top
      const viewerStoryIndex = stories.findIndex(
        (group) => group._id.toString() === context.user?.id.toString()
      );

      if (viewerStoryIndex !== -1) {
        const [viewerStory] = stories.splice(viewerStoryIndex, 1);
        stories.unshift(viewerStory);
      }

      return {
        stories: stories,
        meta: {
          page: args.page,
          limit: args.limit,
          total: stories.length,
          totalPage: totalPages,
          nextPage: page < totalPages ? page + 1 : null,
        },
      };
    },
  },
  StoryGrouped: {
    user: async (parent: any, args: any, context: any) => {
      const user = await User.findById(parent._id);
      return user;
    },
  },
  Mutation: {
    createStory: async (
      _parent: null,
      args: { input: { image: Upload; privacy?: string } },
      context: IResolverContext
    ) => {
      if (!context.user?.id) throw new Error("Unauthorized");
      const cleanAttachments = await uploadFilesToCloudinary(
        args.input.image.promise,
        "connecto/stories"
      );

      const story = await Story.create({
        expiresAt: new Date().getTime() + 24 * 60 * 60 * 1000,
        mediaUrl: (cleanAttachments as any)?.url,
        user: context.user.id,
      });
      return story;
    },
    deleteStory: async (parent: any, args: any, context: any) => {
      const story = await context.prisma.story.delete({
        where: { id: args.id },
      });
      return story;
    },
  },
};
