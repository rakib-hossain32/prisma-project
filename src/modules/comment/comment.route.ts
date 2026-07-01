import express from "express";
import { commentController } from "./comment.controller";

const router: express.Router = express.Router();

router.get("/author/:authorId", commentController.getCommentByAuthorId);

router.get("/:commentId", commentController.getCommentByCommentId);

router.post("/", commentController.createComment);

router.patch("/:commentId", commentController.updateComment);

router.delete("/:commentId", commentController.deleteComment);

router.patch("/:commentId/moderate", commentController.updateCommentByModerate);

export const commentRoute = router;
