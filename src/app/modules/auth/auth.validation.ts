import { z } from "zod";

/**
 * Validation schema for the /auth/sync endpoint.
 * The Firebase ID token is sent in the Authorization header,
 * while user data comes in the request body.
 */
export const SyncAuthSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  profilePicture: z.string().optional(),
});

export const DeleteAccountSchema = z.object({
  confirmText: z.string().optional(),
});

export type SyncAuth = z.infer<typeof SyncAuthSchema>;
export type DeleteAccount = z.infer<typeof DeleteAccountSchema>;