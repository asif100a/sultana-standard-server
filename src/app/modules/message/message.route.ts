import { Router } from "express";
import { MessageController } from "./message.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const messageRoute = Router();
const messageController = new MessageController();

messageRoute.get(
  "/conversation/:partnerId",
  checkAuth(),
  messageController.getConversation.bind(messageController)
);

messageRoute.get("/", checkAuth(), messageController.getAll.bind(messageController));
messageRoute.get("/:id", checkAuth(), messageController.getById.bind(messageController));
messageRoute.post("/", checkAuth(), messageController.create.bind(messageController));
messageRoute.put("/:id", checkAuth(), messageController.update.bind(messageController));
messageRoute.delete("/:id", checkAuth(), messageController.delete.bind(messageController));

export default messageRoute;
