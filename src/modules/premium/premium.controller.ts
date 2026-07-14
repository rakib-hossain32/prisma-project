import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { premiumService } from "./premium.service";
import { sendResponse } from "../../utils/sendResponse";

const getPremiumContent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await premiumService.getPremiumContent(userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Premium Content retrieved successfully",
      data: result,
    });
  },
);

export const premiumController = {
  getPremiumContent,
};
