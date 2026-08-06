import { createClient } from "@supabase/supabase-js";
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

// ======================================================
// SUPABASE SETUP
// ======================================================
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY; // Use Service Role Key or Anon Key
const supabase = createClient(supabaseUrl, supabaseKey);

const uploadImageToSupabase = async (base64File, fileType) => {
  try {
    // 1. Remove Base64 Header (e.g., data:image/png;base64,...)
    const base64Data = base64File.includes(",") 
      ? base64File.split(",")[1] 
      : base64File;
    
    // 2. Convert to Buffer
    const buffer = Buffer.from(base64Data, "base64");
    
    // 3. Generate Unique Filename
    const fileName = `chats/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;

    // 4. Upload to Supabase Storage Bucket ('chat-images')
    const { data, error } = await supabase.storage
      .from("chat-images")
      .upload(fileName, buffer, {
        contentType: fileType || "image/png",
        upsert: false,
      });

    if (error) throw error;

    // 5. Get Public URL
    const { data: urlData } = supabase.storage
      .from("chat-images")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Supabase Upload Error:", error);
    return null;
  }
};

// ======================================================
// NORMAL CHAT
// ======================================================

export const chat = async (req, res) => {
  try {
    const { message, conversationId, file, fileType } = req.body;

    if (!message?.trim() && !file) {
      return res.status(400).json({
        success: false,
        message: "Message or image is required",
      });
    }

    // ====================================
    // Guest Mode
    // ====================================

    if (!req.user) {
      const aiResult = await chatWithAI(
        message,
        [],
        [],
        file,
        fileType
      );

      return res.json({
        success: true,
        guest: true,
        response: aiResult.text,
        intent: aiResult.intent,
      });
    }

    // ====================================
    // Logged In User
    // ====================================

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

    const history = await getConversationMessages(
      currentConversationId
    );

    // Upload Image if it exists
    let uploadedImageUrl = null;
    if (file) {
      uploadedImageUrl = await uploadImageToSupabase(file, fileType);
    }

    // Note: Update saveMessage in conversation.service.js to accept the 4th parameter (imageUrl)
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
          await saveMemory(
            req.user.id,
            memory.key,
            memory.value
          );
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
      fileType
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

      await updateConversationTitle(
        currentConversationId,
        title
      );
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

// ======================================================
// STREAM CHAT
// ======================================================

export const streamChat = async (req, res) => {
  try {
    const { message, conversationId, file, fileType } = req.body;

    if (!message?.trim() && !file) {
      return res.status(400).json({
        success: false,
        message: "Message or image is required",
      });
    }

    // ====================================
    // Guest Mode
    // ====================================

    if (!req.user) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const aiResult = await chatWithAIStream(
        message,
        [],
        [],
        file,
        fileType
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

    // ====================================
    // Logged In User
    // ====================================

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

    const history = await getConversationMessages(
      currentConversationId
    );

    // Upload Image if it exists
    let uploadedImageUrl = null;
    if (file) {
      uploadedImageUrl = await uploadImageToSupabase(file, fileType);
    }

    await saveMessage(
      currentConversationId,
      "user",
      message,
      uploadedImageUrl // URL save ki ja rahi hai
    );

    if (message) {
      const extractedMemories = extractMemory(message);

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
    }

    const storedMemories = await getMemories(req.user.id);

    const aiResult = await chatWithAIStream(
      message,
      history,
      storedMemories,
      file,
      fileType
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

      await updateConversationTitle(
        currentConversationId,
        title
      );
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
    console.error(error);
    let message = "Something went wrong. Please try again.";

    if (
      error.message?.includes("RESOURCE_EXHAUSTED") ||
      error.message?.includes("quota") ||
      error.message?.includes("429")
    ) {
      let retryText = "a few minutes";
      const retryMatch = error.message?.match(/"retryDelay":\s*"(\d+)s"/);

      if (retryMatch) {
        const seconds = Number(retryMatch[1]);
        if (seconds < 60) {
          retryText = `${seconds} seconds`;
        } else if (seconds < 3600) {
          retryText = `${Math.ceil(seconds / 60)} minutes`;
        } else {
          retryText = `${Math.ceil(seconds / 3600)} hour(s)`;
        }
      }

      message = `NovaAI has reached its free AI limit. Please try again after ${retryText}.`;
    }

    res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
    res.end();
  }
};