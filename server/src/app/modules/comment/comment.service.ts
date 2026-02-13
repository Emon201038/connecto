import mongoose from "mongoose";
import { QueryBuilder } from "../../lib/queryBuilder";
import Hashtag from "../hashtag/hashtag.model";
import { IEntity } from "../post/post.interface";
import User from "../user/user.model";
import Comment from "./comment.model";

const getAllComments = async (params: Record<string, string>) => {
  try {
    const builder = new QueryBuilder(Comment, {
      parent: params.parent || "",
      page: params.page || "1",
      limit: params.limit || "15",
      post: params.post || "",
    });
    const comments = await builder.filter().sort().paginate().execWithMeta();
    return comments;
  } catch (error) {
    throw error;
  }
};

const createComment = async (userId: string, input: any) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const entities =
      input.entities?.map(async (entity: IEntity) => {
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

    const newComment = new Comment({
      ...input,
      author: userId,
      entities: resolvedEntities,
    });
    const comment = await newComment.save();
    return comment;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const CommentService = {
  getAllComments,
  createComment,
};
