import express from "express";
import userRoutes from "../modules/user/user.routes";
import authRoutes from "../modules/auth/auth.routes";
import otpRoutes from "../modules/otp/otp.routes";
import postRoutes from "../modules/post/post.routes";

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
];

moduleRoutes.forEach((route) => {
  routerv2.use(route.path, route.route);
});

export default routerv2;
