import { Types } from "mongoose";

export interface MessageType {
  sender: Types.ObjectId | string;
  receiver: Types.ObjectId | string;
  text?: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MessageResponseType {
  success: boolean;
  data?: MessageType | MessageType[];
  message: string;
}