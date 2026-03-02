import express from "express";
import { CommentController } from "./comment.controller";
import { checkAuth } from "../../../../app/middleware/checkAuth";
import { UserRole } from "../../../../../prisma/generated/enums";

const commentRoutes = express.Router();

commentRoutes
  .route("/")
  .get(CommentController.getAllComments)
  .post(checkAuth(...Object.values(UserRole)), CommentController.createComment);

export default commentRoutes;
