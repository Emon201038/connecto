import express from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../../../app/middleware/checkAuth";
import { UserRole } from "../../../../../prisma/generated/enums";
const authRoutes = express.Router();

authRoutes.post("/login", AuthController.login);
authRoutes.get("/refresh-token", AuthController.refreshToken);
authRoutes.get("/me", checkAuth(...Object.values(UserRole)), AuthController.me);

export default authRoutes;
