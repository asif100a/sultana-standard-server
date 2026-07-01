import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { catchAsync } from "../../utils/index";

const authService = new AuthService();

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
        });
        return;
      }

      const firebaseIdToken = authHeader.split(" ")[1]!;
      const { name, email, phone } = req.body;

      const result = await authService.syncUser(firebaseIdToken, {
        name,
        email,
        phone,
      });

      res.status(200).json({
        success: true,
        message: "User synced successfully",
        data: result,
        accessToken: result.accessToken,
      });
    } catch (error: any) {
      if (
        error.code === "auth/id-token-expired" ||
        error.code === "auth/argument-error"
      ) {
        res.status(401).json({
          success: false,
          message: "Invalid or expired Firebase token",
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