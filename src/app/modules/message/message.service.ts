import { type MessageType } from "./message.interface";
import { MessageModel } from "./message.model";

export class MessageService {
  async findAll(): Promise<MessageType[]> {
    return MessageModel.find();
  }

  async findById(id: string): Promise<MessageType | null> {
    return MessageModel.findById(id);
  }

  async getConversation(user1Id: string, user2Id: string): Promise<MessageType[]> {
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

  async update(id: string, data: Partial<MessageType>): Promise<MessageType | null> {
    return MessageModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<void> {
    await MessageModel.findByIdAndDelete(id);
  }
}