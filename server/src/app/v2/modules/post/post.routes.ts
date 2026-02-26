import express from "express";
import { checkAuth } from "../../../middleware/checkAuth";
import { UserRole } from "../../../../../prisma/generated/enums";
import { PostController } from "./post.controller";

const postRoutes = express.Router();

postRoutes
  .route("/")
  .get(checkAuth(...Object.values(UserRole)), PostController.getPosts)
  .post(checkAuth(...Object.values(UserRole)), PostController.createPost);

export default postRoutes;
