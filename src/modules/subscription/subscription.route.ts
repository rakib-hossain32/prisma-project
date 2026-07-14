import { Router } from "express";
import { subscriptionController } from "./subscription.controller";
import { auth } from "../../middleware/auth";
import { ROLE } from "../../../generated/prisma/enums";

const router: Router = Router();

router.post(
  "/create-checkout-session",
  auth(ROLE.ADMIN, ROLE.AUTHOR, ROLE.USER),
  subscriptionController.createCheckoutSession,
);

router.post("/webhook", subscriptionController.handleWebhook);

router.get(
  "/status",
  auth(ROLE.ADMIN, ROLE.AUTHOR, ROLE.USER),
  subscriptionController.getSubscriptionStatus,
);

export const subscriptionRouter = router;
