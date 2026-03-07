import express from "express";
import { StoryController } from "./story.controller";
import { checkAuth } from "../../../../app/middleware/checkAuth";
import { UserRole } from "../../../../../prisma/generated/enums";

const storyRoutes = express.Router();

storyRoutes
  .route("/")
  .get(checkAuth(...Object.values(UserRole)), StoryController.getAllStories)
  .post(checkAuth(...Object.values(UserRole)), StoryController.createStory);

export default storyRoutes;
