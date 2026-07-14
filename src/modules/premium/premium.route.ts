import { Router } from "express";
import { premiumController } from "./premium.controller";
import { auth } from "../../middleware/auth";
import { ROLE } from "../../../generated/prisma/enums";
import { subscriptionGuard } from "../../middleware/premiumGuard";

const router: Router = Router();

router.get(
  "/",
  auth(ROLE.ADMIN, ROLE.AUTHOR, ROLE.USER),
  subscriptionGuard(),
  premiumController.getPremiumContent,
);

export const premiumRouter = router;
