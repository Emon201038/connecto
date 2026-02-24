import { checkAuth } from "./../../../middleware/checkAuth";
import express from "express";
import { seendUsers } from "../../../modules/user/user.controller";
import { UserController } from "./user.controller";
import { UserRole } from "../../../../../prisma/generated/enums";
const userRoutes = express.Router();

userRoutes
  .route("/")
  .get(UserController.getUsers)
  .post(UserController.createUser);

userRoutes.get("/seed", seendUsers);

userRoutes
  .route("/id/:id")
  .get(UserController.getUserById)
  .put(UserController.updateUserById)
  .delete(UserController.deleteUserById);

userRoutes.delete("/id/soft-delete/:id", UserController.softDeleteUserById);
userRoutes.delete(
  "/soft-delete/:username",
  UserController.softDeleteUserByUsername,
);

userRoutes
  .route("/:username")
  .get(UserController.getUserByUsername)
  .put(UserController.updateUserByUsername)
  .delete(UserController.deleteUserByUsername);

export default userRoutes;
