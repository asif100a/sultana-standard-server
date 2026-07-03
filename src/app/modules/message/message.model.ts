import mongoose, { Schema, Document } from "mongoose";
import type { MessageType } from "./message.interface";

export interface MessageDocumentType extends MessageType, Document {}

const MessageSchema: Schema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const MessageModel = mongoose.model<MessageDocumentType>(
  "Message",
  MessageSchema
);