import {
  createConversation,
  getUserConversations,
  getConversationById,
  updateConversationTitle,
  deleteConversation,
  getConversation as getConversationService,
} from "../services/conversation.service.js";

// Create New Conversation
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

// Get All Conversations
export const getConversations = async (req, res) => {
  try {
    const conversations = await getUserConversations(req.user.id);

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

// Get Single Conversation Messages
export const getConversation = async (req, res) => {
  try {
    await getConversationService(
      req.params.id,
      req.user.id
    );

    const messages = await getConversationById(
      req.params.id
    );

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

// Rename Conversation
export const renameConversation = async (req, res) => {
  try {
    await getConversationService(
      req.params.id,
      req.user.id
    );

    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const conversation =
      await updateConversationTitle(
        req.params.id,
        title
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

// Delete Conversation
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