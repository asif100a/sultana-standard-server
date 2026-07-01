import app from "./app";
import connectDB from "./app/config/db";
import { envConfig } from "./app/config/env";

const PORT = envConfig.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📡 Environment: ${envConfig.NODE_ENV}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
