import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import env from "./config/env.js";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import conversationRoutes from "./routes/conversation.routes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://novaai-40ji.onrender.com",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`Origin ${origin} not allowed by CORS`)
      );
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/conversations", conversationRoutes);

export default app;