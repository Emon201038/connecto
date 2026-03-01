import { Prisma } from "../../../../../prisma/generated/client";
import {
  ReactionFor,
  ReactionType,
} from "../../../../../prisma/generated/enums";
import { ReactionCreateInput } from "../../../../../prisma/generated/models";
import prisma from "../../../config/db";
import { IOptions } from "../../../helpers/paginationHelper";

const toggleReaction = async (payload: ReactionCreateInput, userId: string) => {
  let targetField: "postId" | "commentId" | "messageId";

  switch (payload.reactionFor) {
    case "POST":
      targetField = "postId";
      break;
    case "COMMENT":
      targetField = "commentId";
      break;
    case "MESSAGE":
      targetField = "messageId";
      break;
  }
  return await prisma.$transaction(async (tx) => {
    const deleted = await tx.reaction.deleteMany({
      where: {
        type: payload.type,
        userId,
        reactionFor: payload.reactionFor,
        [targetField]: payload.targetId,
      },
    });

    if (deleted.count > 0) {
      return { added: false };
    }

    const reaction = await tx.reaction.create({
      data: {
        type: payload.type,
        reactionFor: payload.reactionFor,
        targetId: payload.targetId,
        userId,
        [targetField]: payload.targetId,
      },
    });

    return reaction;
  });
};

const getReactions = async (
  options: IOptions,
  filters: Record<string, any>,
) => {
  return await prisma.reaction.findMany({});
};

const getSingleUnitReactions = async (
  id: string,
  reactionFor: ReactionFor,
  type?: ReactionType,
) => {
  let targetField: "postId" | "commentId" | "messageId";

  switch (reactionFor) {
    case "POST":
      targetField = "postId";
      break;
    case "COMMENT":
      targetField = "commentId";
      break;
    case "MESSAGE":
      targetField = "messageId";
      break;
  }

  const reactionAndCondition: Prisma.ReactionWhereInput = {
    [targetField]: id,
  };

  if (type) {
    reactionAndCondition.type = type;
  }

  const reactions = await prisma.reaction.findMany({
    where: reactionAndCondition,
  });

  return reactions;
};

export const ReactionService = {
  toggleReaction,
  getReactions,
  getSingleUnitReactions,
};
