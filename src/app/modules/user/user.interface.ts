import type { UserRole } from "../../types";

export interface UserType {
  _id?: string;
  firebaseUid: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  isPhoneVerified: boolean;
  profilePicture?: string;
  dateOfBirth?: Date;
  anniversary?: Date;
}

export interface UserResponseType {
  success: boolean;
  data?: UserType | UserType[];
  message: string;
}