import type { NextFunction, Request, Response } from "express";
import { handleToken, type TokenPayloadType } from "../utils/token.utils";

// Extend Express Request to carry decoded user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayloadType;
    }
  }
}

/**
 * Middleware to check authentication via Bearer token in Authorization header.
 * Verifies the backend JWT (not Firebase token) for protected routes.
 */
export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Read token from Authorization header (Bearer <token>)
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
          success: false,
          message: "Access token missing",
        });
        return;
      }

      const accessToken = authHeader.split(" ")[1]!;
      const decoded = handleToken.verifyAccessToken(accessToken);

      // Check role authorization if roles are specified
      if (authRoles.length > 0 && !authRoles.includes(decoded.role)) {
        res.status(403).json({
          success: false,
          message: "Insufficient permissions",
        });
        return;
      }

      req.user = decoded;
      next();
    } catch (error) {
      res.status(403).json({
        success: false,
        message: "Invalid or expired access token",
      });
    }
  };
