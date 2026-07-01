import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/routes/index";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";

const app = express();

// Middleware
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Sultana Standard Server is running 🚀",
  });
});

// API Routes
app.use("/api/v1", router);

// Error Handling
app.use(globalErrorHandler);
app.use(notFound);

export default app;
