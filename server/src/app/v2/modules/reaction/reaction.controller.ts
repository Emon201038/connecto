import {
  ReactionFor,
  ReactionType,
} from "../../../../../prisma/generated/enums";
import AppError from "../../../helpers/appError";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { pick } from "../../../helpers/pick";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { ReactionService } from "./reaction.service";

const toggleReaction = catchAsync(async (req, res, next) => {
  if (!req.user) throw new AppError(403, "You are not logged in");
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Reaction toggled successfully",
    data: await ReactionService.toggleReaction(req.body, req.user.id),
  });
});

const getReactions = catchAsync(async (req, res, next) => {
  const options = pick(req.query, paginationHelper.paginationFields);
  const filters = pick(req.query, ["postId"]);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Reactions fetched successfully",
    data: await ReactionService.getReactions(options, filters),
  });
});

const getSingleUnitReactions = catchAsync(async (req, res, next) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Reactions fetched successfully",
    data: await ReactionService.getSingleUnitReactions(
      req.params.id,
      req.params.reactionFor as ReactionFor,
      req.query?.type as ReactionType,
    ),
  });
});

export const ReactionController = {
  toggleReaction,
  getReactions,
  getSingleUnitReactions,
};
