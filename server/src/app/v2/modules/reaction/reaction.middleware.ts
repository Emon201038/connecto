import { catchAsync } from "../../../../app/utils/catchAsync";
import { ReactionFor } from "../../../../../prisma/generated/enums";
import AppError from "../../../../app/helpers/appError";
import prisma from "../../../../app/config/db";

const validateParams = catchAsync(async (req, res, next) => {
  const reactionFor = req.params.reactionFor.toUpperCase() as ReactionFor;
  if (!Object.values(ReactionFor).includes(reactionFor))
    next(new AppError(400, "Invalid reactionFor"));

  switch (reactionFor) {
    case ReactionFor.POST:
      const post = await prisma.post.findUnique({
        where: {
          id: req.params.id,
        },
      });

      if (!post) next(new AppError(404, "Post not found"));
      if (post?.isDeleted) next(new AppError(400, "Post is deleted"));
      break;

    case ReactionFor.MESSAGE:
      const message = await prisma.message.findUnique({
        where: {
          id: req.params.id,
        },
      });

      if (!message) next(new AppError(404, "Message not found"));
      if (message?.isDeleted) next(new AppError(400, "Message is deleted"));
      break;

    case ReactionFor.COMMENT:
      const comment = await prisma.comment.findUnique({
        where: {
          id: req.params.id,
        },
      });

      if (!comment) next(new AppError(404, "Comment not found"));
      if (comment?.isDeleted) next(new AppError(400, "Comment is deleted"));
      break;
    default:
      break;
  }

  req.params.reactionFor = reactionFor;
  next();
});

export const ReactionMiddleware = {
  validateParams,
};
