import { type MessageType } from "./message.interface";
import { MessageModel } from "./message.model";
import AppError from "../../errorHandlers/AppError";
import { UserModel } from "../user/user.model";

export class MessageService {
  async findAll(): Promise<MessageType[]> {
    return MessageModel.find();
  }

  async findById(id: string): Promise<MessageType | null> {
    return MessageModel.findById(id);
  }

  async getConversation(user1Id: string, user2Id: string): Promise<MessageType[]> {
    await this.validateChatUsers(user1Id, user2Id);

    return MessageModel.find({
      $or: [
        { sender: user1Id, receiver: user2Id },
        { sender: user2Id, receiver: user1Id },
      ],
    }).sort({ createdAt: 1 });
  }

  async create(data: Partial<MessageType>): Promise<MessageType> {
    return MessageModel.create(data);
  }

  async createForUser(
    senderId: string,
    data: Pick<Partial<MessageType>, "receiver" | "text" | "imageUrl">
  ): Promise<MessageType> {
    const receiverId = data.receiver?.toString();

    if (!receiverId) {
      throw new AppError(400, "Receiver is required");
    }

    if (!data.text && !data.imageUrl) {
      throw new AppError(400, "Message text or image is required");
    }

    await this.validateChatUsers(senderId, receiverId);

    return MessageModel.create({
      sender: senderId,
      receiver: receiverId,
      text: data.text || "",
      imageUrl: data.imageUrl || "",
    });
  }

  async update(id: string, data: Partial<MessageType>): Promise<MessageType | null> {
    return MessageModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<void> {
    await MessageModel.findByIdAndDelete(id);
  }

  private async validateChatUsers(senderId: string, receiverId: string): Promise<void> {
    if (senderId === receiverId) {
      throw new AppError(400, "You cannot start a chat with your own account");
    }

    const [sender, receiver] = await Promise.all([
      UserModel.findById(senderId),
      UserModel.findById(receiverId),
    ]);

    if (!sender || !receiver) {
      throw new AppError(404, "Chat user not found");
    }

    if (!sender.isVerified || !receiver.isVerified) {
      throw new AppError(403, "Only verified users can use chat");
    }
  }
}
