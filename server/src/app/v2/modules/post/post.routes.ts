import express from "express";
import { checkAuth } from "../../../middleware/checkAuth";
import { UserRole } from "../../../../../prisma/generated/enums";
import { PostController } from "./post.controller";
import { uploadImage } from "../../../../app/middleware/uploadFile";

const postRoutes = express.Router();

postRoutes
  .route("/")
  .get(checkAuth(...Object.values(UserRole)), PostController.getPosts)
  .post(
    checkAuth(...Object.values(UserRole)),
    uploadImage.array("attachments", 5),
    PostController.createPost,
  );

export default postRoutes;
