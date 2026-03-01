import express from "express";
import { ReactionController } from "./reaction.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { ReactionFor, UserRole } from "../../../../../prisma/generated/enums";
import { validateRequest } from "../../../middleware/validateRequest";
import { reactionValidationSchema } from "./reaction.validation";
import AppError from "../../../helpers/appError";
import { ReactionMiddleware } from "./reaction.middleware";

const reactionRoutes = express.Router();

reactionRoutes
  .route("/")
  .get(ReactionController.getReactions)
  .post(
    checkAuth(...Object.values(UserRole)),
    validateRequest(reactionValidationSchema),
    ReactionController.toggleReaction,
  );

reactionRoutes
  .route("/:id/:reactionFor")
  .get(
    ReactionMiddleware.validateParams,
    ReactionController.getSingleUnitReactions,
  );

export default reactionRoutes;
