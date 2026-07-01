import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";

const getPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getPostsStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getMyPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getPostById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
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
