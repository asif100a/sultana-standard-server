import { Router } from "express";
import type { Request, Response } from "express";
import { uploadToCloudinary } from "../utils/cloudinary";
import { checkAuth } from "../middlewares/checkAuth";
import { catchAsync } from "../utils";

const uploadRoute = Router();

/**
 * POST /uploads/image
 * Protect with checkAuth since the user must be logged in to chat.
 */
uploadRoute.post(
  "/image",
  checkAuth("USER", "ADMIN", "SUPER_ADMIN"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { image } = req.body;
      if (!image) {
        res.status(400).json({
          success: false,
          message: "Image data (base64) is required",
        });
        return;
      }

      const secureUrl = await uploadToCloudinary(image);
      res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        data: {
          url: secureUrl,
        },
      });
    } catch (error: any) {
      catchAsync(res, error);
    }
  }
);

export default uploadRoute;
