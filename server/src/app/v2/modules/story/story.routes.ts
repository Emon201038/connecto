import express from "express";
import { StoryController } from "./story.controller";

const storyRoutes = express.Router();

storyRoutes.route("/").get().post(StoryController.createStory);

export default storyRoutes;
