import AppError from "../../../../app/helpers/appError";
import { catchAsync } from "../../../../app/utils/catchAsync";
import { sendResponse } from "../../../../app/utils/sendResponse";
import { StoryService } from "./story.service";

const createStory = catchAsync(async (req, res, next) => {
  const user = req.user;
  if (!user) throw new AppError(403, "You are not logged in");

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Story created successfully",
    data: await StoryService.createStory(req.body, user.id, req.file),
  });
});

const getAllStories = catchAsync(async (req, res, next) => {
  const user = req.user;
  if (!user) throw new AppError(403, "You are not logged in");
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Stories fetched successfully",
    data: await StoryService.getAllStories(user.id),
  });
});

export const StoryController = { createStory, getAllStories };
