import http from "http";
import app from "./app";
import connectDB from "./app/config/db";
import { envConfig } from "./app/config/env";
import { initializeSocket } from "./socket";

const PORT = envConfig.PORT || 5000;

const startServer = async () => {
  try {
    const httpServer = http.createServer(app);

    initializeSocket(httpServer);

    httpServer.listen(Number(PORT), "0.0.0.0", async () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${envConfig.NODE_ENV || "development"}`);

      try {
        await connectDB();
      } catch {
        if (envConfig.NODE_ENV === "production") {
          httpServer.close(() => process.exit(1));
          return;
        }

        console.error(
          "Server is running without MongoDB. Database-backed routes may fail until DB_URL is reachable."
        );
      }
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
