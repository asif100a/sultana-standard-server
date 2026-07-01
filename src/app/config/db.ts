import mongoose from "mongoose";
import { envConfig } from "./env";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(envConfig.DB_URL);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
