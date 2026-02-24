import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import routerv2 from "./app/v2/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import prisma from "./app/config/db";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://localhost:3000",
      "http://localhost:5173",
      "https://mycric.app",
      "http://188.245.78.123:3000",
      "https://social-app-git-main-emon201038s-projects.vercel.app/",
      "https://social-app-one-self.vercel.app",
      "https://facebook-client-five.vercel.app",
      "https://connecto-by-emon.vercel.app",
      "http://192.168.0.105:3000",
      // CLIENT_URL,
      // SERVER_URL,
    ],
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"],
  }),
);

app.use("/api/v1", router);
app.use("/api/v2", routerv2);
app.use("/test", async (req, res) => {
  const data = await prisma.otp.deleteMany({});
  res.status(200).json(data);
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Api is working" });
});

// global error handler
app.use(globalErrorHandler);

// not found handler
app.use(notFound);

export { app };
