// Auth model is no longer used as a separate collection.
// User data is stored in the User model, and auth operations
// are handled through Firebase + JWT tokens.
//
// This file is kept for compatibility with the module structure.

import mongoose, { Schema, Document } from "mongoose";
import type { AuthType } from "./auth.interface";

export interface AuthDocumentType extends AuthType, Document {}

const AuthSchema: Schema = new Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const AuthModel = mongoose.model<AuthDocumentType>("Auth", AuthSchema);