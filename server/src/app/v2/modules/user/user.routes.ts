import { checkAuth } from "./../../../middleware/checkAuth";
import express from "express";
import { seendUsers } from "../../../modules/user/user.controller";
import { UserController } from "./user.controller";
import { UserRole } from "../../../../../prisma/generated/enums";
import { validateRequest } from "../../../middleware/validateRequest";
import { userValidationSchema } from "./user.validation";

const userRoutes = express.Router();

userRoutes
  .route("/")
  .get(UserController.getUsers)
  .post(validateRequest(userValidationSchema), UserController.createUser);

userRoutes.get("/seed", seendUsers);

userRoutes.post("/verify-register/:id", UserController.verifyUserRegister);

userRoutes
  .route("/id/:id")
  .get(UserController.getUserById)
  .put(UserController.updateUserById)
  .delete(UserController.deleteUserById);

userRoutes.delete(
  "/id/soft-delete/:id",
  checkAuth(...Object.values(UserRole)),
  UserController.softDeleteUserById,
);
userRoutes.delete(
  "/soft-delete/:username",
  checkAuth(...Object.values(UserRole)),
  UserController.softDeleteUserByUsername,
);

userRoutes
  .route("/:username")
  .get(UserController.getUserByUsername)
  .put(UserController.updateUserByUsername)
  .delete(UserController.deleteUserByUsername);

export default userRoutes;
