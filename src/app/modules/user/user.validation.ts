import { z } from "zod";

export const CreateUserSchema = z.object({
  firebaseUid: z.string().min(1, "Firebase UID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(1).optional(),
  profilePicture: z.string().url().optional(),
  dateOfBirth: z.string().datetime().optional(),
  anniversary: z.string().datetime().optional(),
});

export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;