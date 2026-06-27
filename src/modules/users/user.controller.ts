import { Request, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    const user = await userService.createUserDB(payload);

    // console.log(payload);
    res.status(httpStatus.CREATED).json({
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Registered successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to register user",
      error: (error as Error).message,
    });
  }
};

export const userController = {
  createUser,
};
