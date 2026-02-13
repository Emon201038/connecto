import mongoose from "mongoose";
import Reaction from "./reaction.model";
import { ReactionType } from "./reaction.interface";

const toggleReaction = async (user: string, args: Record<string, string>) => {
  const { targetType, target, type } = args;

  const existing = await Reaction.findOne({ targetType, target, user });

  if (existing) {
    if (!type || existing.type === type) {
      // Case 1: same type OR null → delete
      const deleted = await Reaction.deleteOne({ _id: existing._id });
      return deleted;
    } else {
      // Case 2: different type → update
      existing.type = type as ReactionType;
      await existing.save();
      return existing;
    }
  } else {
    // Case 3: no reaction → create new
    const reaction = new Reaction({
      targetType,
      target,
      user,
      type,
    });
    await reaction.save();
    return reaction;
  }
};

const getReactions = async (target: string, type?: ReactionType) => {
  try {
    return await Reaction.find({
      target: new mongoose.Types.ObjectId(target),
      ...(type && type !== ("ALL" as ReactionType) && { type }),
    });
  } catch (error) {
    throw error;
  }
};

export const ReactionService = { toggleReaction, getReactions };
