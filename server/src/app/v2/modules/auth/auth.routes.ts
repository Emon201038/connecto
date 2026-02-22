import express from "express";
import { seendUsers } from "../../../modules/user/user.controller";
import { AuthController } from "./auth.controller";
const authRoutes = express.Router();

authRoutes.post("/login", AuthController.login);

export default authRoutes;
