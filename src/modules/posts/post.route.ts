import express from "express";
import { postController } from "./post.controller";
import { auth } from "../../middleware/auth";
import { ROLE } from "../../../generated/prisma/enums";

const router: express.Router = express.Router();

router.post(
  "/",
  auth(ROLE.ADMIN, ROLE.AUTHOR, ROLE.USER),
  postController.createPost,
);

router.get("/", postController.getPosts);

router.get("/stats", auth(ROLE.ADMIN, ROLE.USER), postController.getPostsStats);

router.get(
  "/my-posts",
  auth(ROLE.ADMIN, ROLE.AUTHOR, ROLE.USER),
  postController.getMyPosts,
);

router.get("/:postId", postController.getPostById);

router.patch(
  "/:postId",
  auth(ROLE.ADMIN, ROLE.AUTHOR),
  postController.updatePost,
);

router.delete(
  "/:postId",
  auth(ROLE.ADMIN, ROLE.AUTHOR, ROLE.USER),
  postController.deletePost,
);

export const postRoute = router;
