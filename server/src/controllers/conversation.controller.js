import {
  createConversation,
  getUserConversations,
  getConversationById,
  updateConversationTitle,
  deleteConversation,
  getConversation as getConversationService,
  togglePinConversation,
  toggleArchiveConversation,
  createShareToken,
  getConversationByShareToken,
} from "../services/conversation.service.js";

import crypto from "crypto";

// ==============================
// Create New Conversation
// ==============================

export const createNewConversation = async (req, res) => {
  try {
    const conversation = await createConversation(
      req.user.id,
      "New Chat"
    );

    res.status(201).json({
      success: true,
      conversation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get All Conversations
// ==============================

export const getConversations = async (req, res) => {
  try {
    const conversations =
      await getUserConversations(req.user.id);

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Conversation Messages
// ==============================

export const getConversation = async (req, res) => {
  try {
    await getConversationService(
      req.params.id,
      req.user.id
    );

    const messages =
      await getConversationById(req.params.id);

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Rename Conversation
// ==============================

export const renameConversation = async (
  req,
  res
) => {
  try {
    await getConversationService(
      req.params.id,
      req.user.id
    );

    const { title } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const conversation =
      await updateConversationTitle(
        req.params.id,
        title.trim()
      );

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Pin / Unpin Conversation
// ==============================

export const pinConversation = async (
  req,
  res
) => {
  try {
    await getConversationService(
      req.params.id,
      req.user.id
    );

    const { isPinned } = req.body;

    const conversation =
      await togglePinConversation(
        req.params.id,
        isPinned
      );

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Archive / Restore Conversation
// ==============================

export const archiveConversation = async (
  req,
  res
) => {
  try {
    await getConversationService(
      req.params.id,
      req.user.id
    );

    const { isArchived } = req.body;

    const conversation =
      await toggleArchiveConversation(
        req.params.id,
        isArchived
      );

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Share Conversation
export const shareConversation = async (
  req,
  res
) => {
  try {
    await getConversationService(
      req.params.id,
      req.user.id
    );

    const shareToken =
      crypto.randomUUID();

    await createShareToken(
      req.params.id,
      shareToken
    );

    res.status(200).json({
      success: true,
      shareUrl: `${process.env.CLIENT_URL}/share/${shareToken}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==============================
// Delete Conversation
// ==============================

export const removeConversation = async (
  req,
  res
) => {
  try {
    await getConversationService(
      req.params.id,
      req.user.id
    );

    await deleteConversation(req.params.id);

    res.status(200).json({
      success: true,
      message:
        "Conversation deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Shared Conversation
// ==============================

export const getSharedConversation = async (
  req,
  res
) => {
  try {
    const conversation =
      await getConversationByShareToken(
        req.params.token
      );

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};