import { catchAsync } from "../../../../app/utils/catchAsync";
import { sendResponse } from "../../../../app/utils/sendResponse";
import { StoryService } from "./story.service";

const createStory = catchAsync(async (req, res, next) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Story created successfully",
    data: await StoryService.createStory(req.body),
  });
});

export const StoryController = { createStory };
