import jwt from "jsonwebtoken";
import { envConfig } from "../config/env";

export interface TokenPayloadType {
  userId: string;
  firebaseUid: string;
  email: string;
  role: string;
}

export const handleToken = {
  /**
   * Generate a short-lived access token (default 1h)
   */
  generateAccessToken(payload: TokenPayloadType): string {
    return jwt.sign(payload, envConfig.JWT_ACCESS_SECRET, {
      expiresIn: envConfig.JWT_ACCESS_EXPIRES_IN,
    });
  },

  /**
   * Generate a long-lived refresh token (default 7d)
   */
  generateRefreshToken(payload: TokenPayloadType): string {
    return jwt.sign(payload, envConfig.JWT_REFRESH_SECRET, {
      expiresIn: envConfig.JWT_REFRESH_EXPIRES_IN,
    });
  },

  /**
   * Verify and decode an access token
   */
  verifyAccessToken(token: string): TokenPayloadType {
    return jwt.verify(token, envConfig.JWT_ACCESS_SECRET) as TokenPayloadType;
  },

  /**
   * Verify and decode a refresh token
   */
  verifyRefreshToken(token: string): TokenPayloadType {
    return jwt.verify(token, envConfig.JWT_REFRESH_SECRET) as TokenPayloadType;
  },
};
