import {
  chatWithAI,
  chatWithAIStream,
} from "../services/ai.service.js";

import {
  createConversation,
  saveMessage,
  touchConversation,
  getConversationMessages,
} from "../services/conversation.service.js";

import { extractMemory } from "../utils/memoryExtractor.js";

import {
  saveMemory,
  getMemories,
} from "../services/memory.service.js";

export const chat = async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    let currentConversationId = conversationId;

    // Create conversation if needed
    if (!currentConversationId) {
      const conversation = await createConversation(
        req.user.id,
        message.substring(0, 40)
      );

      currentConversationId = conversation.id;
    }

    // Previous history
    const history = await getConversationMessages(
      currentConversationId
    );

    // Save user message
    await saveMessage(
      currentConversationId,
      "user",
      message
    );

    // -------------------------
    // Extract Memory
    // -------------------------

    const extractedMemories =
      extractMemory(message);

    for (const memory of extractedMemories) {
      try {
        await saveMemory(
          req.user.id,
          memory.key,
          memory.value
        );
      } catch (err) {
        console.error(
          "Memory Save Error:",
          err.message
        );
      }
    }

    // -------------------------
    // Load Stored Memories
    // -------------------------

    const storedMemories =
      await getMemories(req.user.id);

    // -------------------------
    // Ask Gemini
    // -------------------------

    const aiResult = await chatWithAI(
      message,
      history,
      storedMemories
    );

    const aiReply = aiResult.text;

    // Save AI response
    await saveMessage(
      currentConversationId,
      "assistant",
      aiReply
    );

    await touchConversation(
      currentConversationId
    );

    return res.json({
      success: true,
      conversationId: currentConversationId,
      response: aiReply,
    });

  } catch (error) {

    console.error(
      "AI Controller Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const streamChat = async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    let currentConversationId = conversationId;

    if (!currentConversationId) {
      const conversation =
        await createConversation(
          req.user.id,
          message.substring(0, 40)
        );

      currentConversationId =
        conversation.id;
    }

    const history =
      await getConversationMessages(
        currentConversationId
      );

    await saveMessage(
      currentConversationId,
      "user",
      message
    );

    const extractedMemories =
      extractMemory(message);

    for (const memory of extractedMemories) {
      try {
        await saveMemory(
          req.user.id,
          memory.key,
          memory.value
        );
      } catch (err) {
        console.error(err.message);
      }
    }

    const storedMemories =
      await getMemories(req.user.id);

    const aiResult =
      await chatWithAIStream(
        message,
        history,
        storedMemories
      );

    res.setHeader(
      "Content-Type",
      "text/event-stream"
    );

    res.setHeader(
      "Cache-Control",
      "no-cache"
    );

    res.setHeader(
      "Connection",
      "keep-alive"
    );

    let fullResponse = "";

    for await (const chunk of aiResult.stream) {
      const text =
        chunk.text || "";

      fullResponse += text;

      res.write(
        `data: ${JSON.stringify({
          text,
        })}\n\n`
      );
    }

    await saveMessage(
      currentConversationId,
      "assistant",
      fullResponse
    );

    await touchConversation(
      currentConversationId
    );

    res.write(
      `data: ${JSON.stringify({
        done: true,
        conversationId:
          currentConversationId,
      })}\n\n`
    );

    res.end();

  } catch (error) {
    console.error(error);

    res.write(
      `data: ${JSON.stringify({
        error: error.message,
      })}\n\n`
    );

    res.end();
  }
};