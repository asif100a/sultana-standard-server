import { Router } from "express";
import authRoute from "../modules/auth/auth.route";
import userRoute from "../modules/user/user.route";
import messageRoute from "../modules/message/message.route";
import uploadRoute from "./upload.route";

const router = Router();

router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/messages", messageRoute);
router.use("/uploads", uploadRoute);

export default router;
