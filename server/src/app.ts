import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

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

// app.use("/v1/users", userRouter);
// app.use("/v1/conversations", conversationRouter);
// app.use("/v1/message", messageRouter);
// app.use("/v1/auth", authRouter);

// app.use((req, res, next) => {
//   console.log('Incoming Request:', req.body);
//   next();
// });

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Api is working" });
});

export { app };
