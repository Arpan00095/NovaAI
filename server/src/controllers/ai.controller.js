import supabase from "../config/supabase.js";

import {
  chatWithAI,
  chatWithAIStream,
  generateConversationTitle,
} from "../services/ai.service.js";

import {
  createConversation,
  saveMessage,
  touchConversation,
  getConversationMessages,
  updateConversationTitle,
} from "../services/conversation.service.js";

import { extractMemory } from "../utils/memoryExtractor.js";

import {
  saveMemory,
  getMemories,
} from "../services/memory.service.js";

// Helper Function
const uploadImageToSupabase = async (base64File, fileType) => {
  try {
    const base64Data = base64File.includes(",")
      ? base64File.split(",")[1]
      : base64File;

    const buffer = Buffer.from(base64Data, "base64");
    const fileName = `chats/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;

    const { error } = await supabase.storage
      .from("chat-images")
      .upload(fileName, buffer, {
        contentType: fileType || "image/png",
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("chat-images")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Supabase Upload Error:", error);
    return null;
  }
};

// NORMAL CHAT
export const chat = async (req, res) => {
  try {
    const { message, conversationId, file, fileType, model = "groq-llama" } = req.body;

    if (!message?.trim() && !file) {
      return res.status(400).json({
        success: false,
        message: "Message or image is required",
      });
    }

    // Guest Mode
    if (!req.user) {
      const aiResult = await chatWithAI(
        message,
        [],
        [],
        file,
        fileType,
        model
      );

      return res.json({
        success: true,
        guest: true,
        response: aiResult.text,
        intent: aiResult.intent,
      });
    }

    // Logged In User
    let currentConversationId = conversationId;
    let isNewConversation = false;

    if (!currentConversationId) {
      const conversation = await createConversation(
        req.user.id,
        "New Chat"
      );
      currentConversationId = conversation.id;
      isNewConversation = true;
    }

    const history = await getConversationMessages(currentConversationId);

    let uploadedImageUrl = null;
    if (file) {
      uploadedImageUrl = await uploadImageToSupabase(file, fileType);
    }

    await saveMessage(
      currentConversationId,
      "user",
      message,
      uploadedImageUrl
    );

    if (message) {
      const extractedMemories = extractMemory(message);
      for (const memory of extractedMemories) {
        try {
          await saveMemory(req.user.id, memory.key, memory.value);
        } catch (err) {
          console.error("Memory Save Error:", err.message);
        }
      }
    }

    const storedMemories = await getMemories(req.user.id);

    const aiResult = await chatWithAI(
      message,
      history,
      storedMemories,
      file,
      fileType,
      model
    );

    await saveMessage(
      currentConversationId,
      "assistant",
      aiResult.text
    );

    if (isNewConversation) {
      const title = await generateConversationTitle(
        message || "Image uploaded"
      );
      await updateConversationTitle(currentConversationId, title);
    }

    await touchConversation(currentConversationId);

    return res.json({
      success: true,
      conversationId: currentConversationId,
      response: aiResult.text,
      intent: aiResult.intent,
    });
  } catch (error) {
    console.error("AI Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// STREAM CHAT
export const streamChat = async (req, res) => {
  try {
    const { message, conversationId, file, fileType, model = "groq-llama" } = req.body;

    if (!message?.trim() && !file) {
      return res.status(400).json({
        success: false,
        message: "Message or image is required",
      });
    }

    // Guest Mode
    if (!req.user) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const aiResult = await chatWithAIStream(
        message,
        [],
        [],
        file,
        fileType,
        model
      );

      for await (const chunk of aiResult.stream) {
        const text = chunk.text || "";
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }

      res.write(
        `data: ${JSON.stringify({
          done: true,
          guest: true,
        })}\n\n`
      );

      return res.end();
    }

    // Logged In User
    let currentConversationId = conversationId;
    let isNewConversation = false;

    if (!currentConversationId) {
      const conversation = await createConversation(
        req.user.id,
        "New Chat"
      );
      currentConversationId = conversation.id;
      isNewConversation = true;
    }

    const history = await getConversationMessages(currentConversationId);

    let uploadedImageUrl = null;
    if (file) {
      uploadedImageUrl = await uploadImageToSupabase(file, fileType);
    }

    await saveMessage(
      currentConversationId,
      "user",
      message,
      uploadedImageUrl
    );

    if (message) {
      const extractedMemories = extractMemory(message);
      for (const memory of extractedMemories) {
        try {
          await saveMemory(req.user.id, memory.key, memory.value);
        } catch (err) {
          console.error(err.message);
        }
      }
    }

    const storedMemories = await getMemories(req.user.id);

    const aiResult = await chatWithAIStream(
      message,
      history,
      storedMemories,
      file,
      fileType,
      model
    );

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";

    for await (const chunk of aiResult.stream) {
      const text = chunk.text || "";
      fullResponse += text;
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    }

    await saveMessage(
      currentConversationId,
      "assistant",
      fullResponse
    );

    if (isNewConversation) {
      const title = await generateConversationTitle(
        message || "Image uploaded"
      );
      await updateConversationTitle(currentConversationId, title);
    }

    await touchConversation(currentConversationId);

    res.write(
      `data: ${JSON.stringify({
        done: true,
        conversationId: currentConversationId,
      })}\n\n`
    );

    res.end();
  } catch (error) {
    console.error("Stream Controller Error:", error);
    let message = "Something went wrong. Please try again.";

    if (
      error.message?.includes("RESOURCE_EXHAUSTED") ||
      error.message?.includes("quota") ||
      error.message?.includes("429")
    ) {
      message = "NovaAI limit reached. Please try again in a few minutes.";
    }

    res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
    res.end();
  }
};