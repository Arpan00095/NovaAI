import { Router } from "express";

import verifyToken from "../middleware/auth.middleware.js";

import {
  createNewConversation,
  getConversations,
  getConversation,
  renameConversation,
  removeConversation,
} from "../controllers/conversation.controller.js";

const router = Router();

router.use(verifyToken);

// Create Conversation
router.post("/", createNewConversation);

// Get All Conversations
router.get("/", getConversations);

// Get Conversation Messages
router.get("/:id", getConversation);

// Rename Conversation
router.patch("/:id", renameConversation);

// Delete Conversation
router.delete("/:id", removeConversation);

export default router;