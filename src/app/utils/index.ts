import type { Response } from "express";

/**
 * Catch async errors and send a standardized error response
 */
export const catchAsync = (res: Response, error: any) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Something went wrong!";

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export { handleToken, type TokenPayloadType } from "./token.utils";
