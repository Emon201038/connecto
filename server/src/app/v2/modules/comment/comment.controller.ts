import { sendResponse } from "../../../../app/utils/sendResponse";
import { catchAsync } from "../../../../app/utils/catchAsync";
import { CommentService } from "./comment.service";
import { pick } from "../../../../app/helpers/pick";
import { paginationHelper } from "../../../../app/helpers/paginationHelper";
import AppError from "../../../../app/helpers/appError";

const getAllComments = catchAsync(async (req, res, next) => {
  const options = pick(req.query, paginationHelper.paginationFields);
  const filters = pick(req.query, ["postId", "userId", "isDeleted"]);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Comments fetched successfully",
    data: (await CommentService.getComments(options, filters)).map((c) => ({
      ...c,
      reactionSummary: [],
    })),
  });
});

const createComment = catchAsync(async (req, res, next) => {
  const user = req.user;
  if (!user) throw new AppError(403, "You are not logged in");

  req.body.userId = user.id;
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Comment created successfully",
    data: await CommentService.createComment(req.body),
  });
});

export const CommentController = {
  getAllComments,
  createComment,
};
