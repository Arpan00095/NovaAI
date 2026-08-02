import { Router } from "express";

import {
  chat,
  streamChat,
} from "../controllers/ai.controller.js";

import verifyToken from "../middleware/auth.middleware.js";

import { validateChatMessage } from "../middleware/validation.middleware.js";

const router = Router();

// Normal Chat
router.post(
  "/chat",
  verifyToken,
  validateChatMessage,
  chat
);

// Streaming Chat
router.post(
  "/chat/stream",
  verifyToken,
  validateChatMessage,
  streamChat
);

export default router;