import { Router } from "express";
import { UserController } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const userRoute = Router();
const userController = new UserController();

// Protected routes — require authentication
userRoute.get(
  "/me",
  checkAuth("USER", "ADMIN", "SUPER_ADMIN"),
  userController.getMe.bind(userController)
);
userRoute.patch(
  "/me",
  checkAuth("USER", "ADMIN", "SUPER_ADMIN"),
  userController.updateMe.bind(userController)
);

// Admin routes
userRoute.get("/", checkAuth("USER", "ADMIN", "SUPER_ADMIN"), userController.getAll.bind(userController));
userRoute.get("/:id", checkAuth("ADMIN", "SUPER_ADMIN"), userController.getById.bind(userController));
userRoute.put("/:id", checkAuth("ADMIN", "SUPER_ADMIN"), userController.update.bind(userController));
userRoute.delete("/:id", checkAuth("ADMIN", "SUPER_ADMIN"), userController.delete.bind(userController));

export default userRoute;