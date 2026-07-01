import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";

const getCommentByAuthorId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getCommentByCommentId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const updateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const deleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const updateCommentByModerate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const commentController = {
  getCommentByAuthorId,
  getCommentByCommentId,
  createComment,
  updateComment,
  deleteComment,
  updateCommentByModerate,
};
