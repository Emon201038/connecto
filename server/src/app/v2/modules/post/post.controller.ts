import AppError from "../../../helpers/appError";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { pick } from "../../../helpers/pick";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { postFilterableFields } from "./post.constant";
import { PostService } from "./post.service";

const getPosts = catchAsync(async (req, res, next) => {
  const options = pick(req.query, paginationHelper.paginationFields);
  const filters = pick(req.query, postFilterableFields);

  const user = req.user;
  if (!user) throw new AppError(403, "You are not logged in");
  const data = await PostService.getPostsFromDB(options, filters, user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Posts fetched successfully",
    meta: data.meta,
    data: data.data,
  });
});

const createPost = catchAsync(async (req, res, next) => {
  if (!req.user) throw new AppError(403, "You are not logged in");
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Post created successfully",
    data: await PostService.createPost(req.body, req.user.id),
  });
});

export const PostController = { getPosts, createPost };
