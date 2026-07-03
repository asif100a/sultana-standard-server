import type { UserType } from "../user/user.interface";

export interface SyncRequestBody {
  name: string;
  email: string;
  phone: string;
  profilePicture?: string;
}

export interface AuthResponseType {
  success: boolean;
  message: string;
  data?: {
    user: UserType;
    accessToken: string;
    refreshToken: string;
  };
}

// Legacy interface kept for compatibility
export interface AuthType {
  firebaseUid: string;
  userId: string;
}