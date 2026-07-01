import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { SyncAuthSchema } from "./auth.validation";

const authRoute = Router();
const authController = new AuthController();

// POST /auth/sync — Firebase token + user data → backend JWT
authRoute.post(
  "/sync",
  validateRequest(SyncAuthSchema),
  authController.sync.bind(authController)
);

// GET /auth/check — Verify backend JWT and return user data
authRoute.get(
  "/check",
  checkAuth("USER", "ADMIN", "SUPER_ADMIN"),
  authController.check.bind(authController)
);

// POST /auth/logout — Clear session
authRoute.post(
  "/logout",
  checkAuth("USER", "ADMIN", "SUPER_ADMIN"),
  authController.logout.bind(authController)
);

// POST /auth/delete — Delete user account
authRoute.post(
  "/delete",
  checkAuth("USER", "ADMIN", "SUPER_ADMIN"),
  authController.deleteAccount.bind(authController)
);

export default authRoute;