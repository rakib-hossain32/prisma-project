import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import config from "./config";

import { userRouter } from "./modules/users/user.route";
import { authRouter } from "./modules/auth/auth.route";
import { postRoute } from "./modules/posts/post.route";
import { commentRoute } from "./modules/comment/comment.route";
import { notFound } from "./middleware/notFound";
import { globalErrorHandler } from "./middleware/globalErrorHandler";

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);

app.use(notFound);

// app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//   res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//     success: false,
//     statusCode: httpStatus.INTERNAL_SERVER_ERROR,
//     message: err.message,
//     error: err.stack,
//   });
// });
app.use(globalErrorHandler);

export default app;
