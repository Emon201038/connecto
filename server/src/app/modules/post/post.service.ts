import mongoose from "mongoose";
import { QueryBuilder } from "../../lib/queryBuilder";
import Hashtag from "../hashtag/hashtag.model";
import User from "../user/user.model";
import { IEntity, IPost } from "./post.interface";
import Post from "./post.model";
import { uploadFilesToCloudinary } from "../../utils/upload-files";
import { FileUpload } from "graphql-upload-ts";

interface CreatePostPayload extends Omit<IPost, "attachments"> {
  attachments?: (Promise<FileUpload | null> | null)[];
}

const getAllPosts = async (queries: Record<string, string>) => {
  const builder = new QueryBuilder(Post, queries);

  // Optional pre-filter for user-based queries
  if (queries.username) {
    // Find user by username
    const user = await User.findOne({ username: queries.username });
    if (!user)
      return {
        posts: [],
        meta: { total: 0, page: queries.page || 1, limit: queries.limit || 10 },
      };
    queries.author = user._id.toString(); // replace username with userId
    delete queries.username;
  }

  const res = await builder
    .filter()
    .search(["content"])
    .sort()
    .paginate()
    .execWithMeta();

  return { posts: res.data, meta: res.meta };
};

const createPost = async (payload: Partial<IPost>, authorId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(authorId).session(session);
    if (!user) {
      throw new Error("User not found");
    }

    const entities =
      payload.entities?.map(async (entity) => {
        if (entity.type === "mention" && entity.target) {
          return { ...entity, model: "User" };
        }

        if (entity.type === "hashtag" && entity.text) {
          const hashtag = await Hashtag.findOneAndUpdate(
            { tag: entity.text },
            {
              $inc: { usageCount: 1 },
              $setOnInsert: { createdBy: user._id },
            },
            { new: true, upsert: true, session },
          );

          return {
            ...entity,
            model: "Hashtag",
            target: hashtag._id,
          };
        }

        return null;
      }) || [];

    const resolvedEntities = (await Promise.all(entities)).filter(Boolean);

    const cleanAttachments = await uploadFilesToCloudinary(
      payload.attachments?.map((a) => (a as any).promise) as any[],
      "connecto/post",
    );

    const post = await Post.create(
      [
        {
          ...payload,
          author: user._id,
          entities: resolvedEntities,
          attachments: cleanAttachments,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return post[0]; // Post.create returns an array when using sessions
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err, "service err");
    throw err;
  }
};

const getPostEntities = async (defaultEntities: IEntity[]) => {
  try {
    // console.log(defaultEntities, "defaultEntities");
    const entities = await Promise.all(
      defaultEntities.map(async (entity) => {
        if (entity.model === "User") {
          const user = await User.findById(entity.target);
          return { ...entity, target: user?.toJSON() };
        }
        if (entity.model === "Hashtag") {
          const hashtag = await Hashtag.findById(entity.target);
          return { ...entity, target: hashtag?.toJSON() };
        }
        return entity;
      }),
    );

    return entities;
  } catch (error) {
    console.error("Error fetching post entities:", error);
    throw new Error("Failed to fetch post entities");
  }
};

const getUsersPosts = async (queries: Record<string, string>) => {};

export const PostService = {
  getAllPosts,
  createPost,
  getPostEntities,
  getUsersPosts,
};
