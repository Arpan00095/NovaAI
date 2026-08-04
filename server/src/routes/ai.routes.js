import { Router } from "express";

import {
  chat,
  streamChat,
} from "../controllers/ai.controller.js";

import optionalAuth from "../middleware/optionalAuth.middleware.js";

import { validateChatMessage } from "../middleware/validation.middleware.js";

const router = Router();

router.post(
  "/chat",
  optionalAuth,
  validateChatMessage,
  chat
);

router.post(
  "/chat/stream",
  optionalAuth,
  validateChatMessage,
  streamChat
);

export default router;