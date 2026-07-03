import http from "http";
import app from "./app";
import connectDB from "./app/config/db";
import { envConfig } from "./app/config/env";
import { initializeSocket } from "./socket";

const PORT = envConfig.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Create HTTP server
    const httpServer = http.createServer(app);

    // Initialize Socket.io
    initializeSocket(httpServer);

    // Start Express/HTTP server
    httpServer.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📡 Environment: ${envConfig.NODE_ENV}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
