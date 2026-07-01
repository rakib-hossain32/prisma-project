import { Router } from "express";
import { userController } from "./user.controller";

import { ROLE } from "../../../generated/prisma/enums";

import { auth } from "../../middleware/auth";

const router: Router = Router();

router.post("/register", userController.createUser);

router.get(
  "/me",
  auth(ROLE.ADMIN, ROLE.AUTHOR, ROLE.USER),
  userController.getMyProfile,
);

router.put("/my-profile", auth(ROLE.ADMIN, ROLE.AUTHOR, ROLE.USER), userController.updateMyProfile);

export const userRouter = router;
