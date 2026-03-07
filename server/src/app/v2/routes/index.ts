import express from "express";
import userRoutes from "../modules/user/user.routes";
import authRoutes from "../modules/auth/auth.routes";
import otpRoutes from "../modules/otp/otp.routes";
import postRoutes from "../modules/post/post.routes";
import reactionRoutes from "../modules/reaction/reaction.routes";
import commentRoutes from "../modules/comment/comment.routes";
import storyRoutes from "../modules/story/story.routes";

const routerv2 = express.Router();
const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/otp",
    route: otpRoutes,
  },
  {
    path: "/posts",
    route: postRoutes,
  },
  {
    path: "/reactions",
    route: reactionRoutes,
  },
  {
    path: "/comments",
    route: commentRoutes,
  },
  {
    path: "/stories",
    route: storyRoutes,
  },
];

moduleRoutes.forEach((route) => {
  routerv2.use(route.path, route.route);
});

export default routerv2;
