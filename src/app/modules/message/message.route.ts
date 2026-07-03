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

messageRoute.get("/", messageController.getAll.bind(messageController));
messageRoute.get("/:id", messageController.getById.bind(messageController));
messageRoute.post("/", messageController.create.bind(messageController));
messageRoute.put("/:id", messageController.update.bind(messageController));
messageRoute.delete("/:id", messageController.delete.bind(messageController));

export default messageRoute;