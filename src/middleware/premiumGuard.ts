import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { prisma } from "../lib/prisma";
import { SubscriptionStatus } from "../../generated/prisma/enums";

export const subscriptionGuard = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const subscriptionExist = await prisma.subscription.findUnique({
      where: {
        userId,
      },
    });

    if (!subscriptionExist) {
      throw new Error("Please subscribe to ge access to Premium contests");
    }

    if (subscriptionExist?.status !== SubscriptionStatus.ACTIVE) {
      throw new Error(
        "Please subscribe again to get access to premium contents",
      );
    }
    next();
  });
};
