import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";

const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const payload = req.body;

    const result = await postService.createPost(payload, userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Post Created Successfully",
      data: result,
    });
  },
);

const getPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const query = req.query

    

    const posts = await postService.getPosts(query);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Posts Retrieved successfully.",
      data: posts,
    });
  },
);

const getPostsStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getPostStats();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post stats Retrieved successfully.",
      data: result,
    });
  },
);

const getMyPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const result = await postService.getMyPosts(authorId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "My Post Retrieved Successfully.",
      data: result,
    });
  },
);

const getPostById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;

    if (!postId) {
      throw new Error("Post Id Required In Params");
    }

    const result = await postService.getPostById(postId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post Retrieved Successfully.",
      data: result,
    });
  },
);
const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";
    const postId = req.params.postId;
    const payload = req.body;

    const result = await postService.updatePost(
      postId as string,
      payload,
      authorId,
      isAdmin,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post updated successfully.",
      data: result,
    });
  },
);
const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";
    const postId = req.params.postId;

    await postService.deletePost(postId as string, authorId, isAdmin);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post Deleted successfully.",
    });
  },
);

export const postController = {
  getPosts,
  getPostsStats,
  getMyPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
