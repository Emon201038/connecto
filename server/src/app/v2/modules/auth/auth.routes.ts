import express from "express";
import { AuthController } from "./auth.controller";
const authRoutes = express.Router();

authRoutes.post("/login", AuthController.login);
authRoutes.get("/refresh-token", AuthController.refreshToken);

export default authRoutes;
