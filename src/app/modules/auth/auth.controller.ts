import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { catchAsync } from "../../utils/index";
import { envConfig } from "../../config/env";

const authService = new AuthService();

const getFirebaseTokenErrorMessage = (error: any) => {
  if (error.code === "auth/id-token-expired") {
    return "Firebase token expired. Please sign in again.";
  }

  return error.message || "Firebase token could not be verified.";
};

const isFirebaseTokenVerificationError = (error: any) =>
  typeof error?.code === "string" && error.code.startsWith("auth/");

const isFirebaseNetworkError = (error: any) => {
  const message = String(error?.message || "").toLowerCase();
  const causeCode = String(error?.cause?.code || "").toLowerCase();

  return (
    causeCode === "eacces" ||
    causeCode === "econnrefused" ||
    causeCode === "etimedout" ||
    message.includes("error code: eacces") ||
    message.includes("error code: econnrefused") ||
    message.includes("error code: etimedout") ||
    message.includes("unable to connect")
  );
};

export class AuthController {
  /**
   * POST /auth/sync
   * Receives Firebase ID token + user data, syncs with backend DB
   * Authorization: Bearer <firebase-id-token>
   */
  async sync(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
          success: false,
          message: "Firebase ID token is required",
          errorCode: "FIREBASE_TOKEN_REQUIRED",
        });
        return;
      }

      const firebaseIdToken = authHeader.split(" ")[1]!;
      const { name, email, phone, profilePicture } = req.body;

      const result = await authService.syncUser(firebaseIdToken, {
        name,
        email,
        phone,
        profilePicture,
      });

      res.status(200).json({
        success: true,
        message: "User synced successfully",
        data: result,
        accessToken: result.accessToken,
      });
    } catch (error: any) {
      if (isFirebaseNetworkError(error)) {
        console.error("Firebase token verification service is unreachable:", {
          code: error.code,
          message: error.message,
        });

        res.status(503).json({
          success: false,
          message:
            "Authentication service is temporarily unavailable. Please try again.",
          errorCode: "FIREBASE_AUTH_UNAVAILABLE",
        });
        return;
      }

      if (isFirebaseTokenVerificationError(error)) {
        console.error("Firebase token verification failed:", {
          code: error.code,
          message: error.message,
        });

        res.status(401).json({
          success: false,
          message: getFirebaseTokenErrorMessage(error),
          errorCode: "INVALID_FIREBASE_TOKEN",
          details:
            envConfig.NODE_ENV === "development"
              ? {
                  firebaseCode: error.code,
                  firebaseMessage: error.message,
                }
              : undefined,
        });
        return;
      }
      catchAsync(res, error);
    }
  }

  /**
   * GET /auth/check
   * Verifies the backend JWT and returns user data.
   * Authorization: Bearer <backend-jwt>
   */
  async check(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const user = await authService.checkAuth(req.user as any);

      res.status(200).json({
        success: true,
        message: "Authenticated",
        data: user,
      });
    } catch (error: any) {
      catchAsync(res, error);
    }
  }

  /**
   * POST /auth/logout
   * Clears any server-side session (primarily a client-side operation)
   */
  async logout(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      catchAsync(res, error);
    }
  }

  /**
   * POST /auth/delete
   * Deletes the user account from both Firebase and the database
   */
  async deleteAccount(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      await authService.deleteAccount((req.user as any).firebaseUid);

      res.status(200).json({
        success: true,
        message: "Account deleted successfully",
      });
    } catch (error: any) {
      catchAsync(res, error);
    }
  }
}
