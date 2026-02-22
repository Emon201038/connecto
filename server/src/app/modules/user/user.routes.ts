import express from "express";
import prisma from "../../config/db";
import { seendUsers } from "./user.controller";
const userRoutes = express.Router();

userRoutes
  .route("/")
  .get(async (req, res, next) => {
    try {
      const data = await prisma.user.findMany();

      res.status(200).json(data);
    } catch (error) {
      res.status(400).json(error);
    }
  })
  .post(seendUsers);

export default userRoutes;
