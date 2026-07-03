import { v2 as cloudinary } from "cloudinary";
import { envConfig } from "../config/env";

cloudinary.config({
  cloud_name: envConfig.CLOUDINARY_CLOUD_NAME,
  api_key: envConfig.CLOUDINARY_API_KEY,
  api_secret: envConfig.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a base64 encoded image to Cloudinary and returns the secure URL.
 * @param base64Str Base64 image data string (can include data URI scheme prefix)
 */
export const uploadToCloudinary = async (base64Str: string): Promise<string> => {
  const result = await cloudinary.uploader.upload(base64Str, {
    resource_type: "auto",
    folder: "love_app",
  });
  return result.secure_url;
};
