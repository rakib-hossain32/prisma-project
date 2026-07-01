import express from "express";
import { postController } from "./post.controller";

const router: express.Router = express.Router();

router.get("/", postController.getPosts);

router.get("/stats", postController.getPostsStats);

router.get("/my-posts", postController.getMyPosts);

router.get("/:postId", postController.getPostById);

router.post("/posts", postController.createPost);

router.patch("/:postId", postController.updatePost);

router.delete("/:postId", postController.deletePost);

export const postRoute = router;
