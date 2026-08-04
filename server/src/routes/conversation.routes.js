import { Router } from "express";

import verifyToken from "../middleware/auth.middleware.js";

import {
  createNewConversation,
  getConversations,
  getConversation,
  renameConversation,
  removeConversation,
  pinConversation,
  archiveConversation,
  shareConversation,
  getSharedConversation,
} from "../controllers/conversation.controller.js";

const router = Router();

// Public Shared Conversation
router.get(
  "/share/:token",
  getSharedConversation
);

router.use(verifyToken);

// Create Conversation
router.post("/", createNewConversation);

// Get All Conversations
router.get("/", getConversations);

// Get Conversation Messages
router.get("/:id", getConversation);

// Rename Conversation
router.patch("/:id", renameConversation);

// Pin / Unpin Conversation
router.patch("/:id/pin", pinConversation);

// Archive / Restore Conversation
router.patch("/:id/archive", archiveConversation);

// Share Chat
router.post("/:id/share", shareConversation);

// Delete Conversation
router.delete("/:id", removeConversation);

export default router;