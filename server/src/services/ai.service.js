import { GoogleGenAI } from "@google/genai";
import env from "../config/env.js";
import { detectIntent } from "./intent.service.js";
import { aiToolRouter } from "../router/ai.tool.router.js";
import { SYSTEM_PROMPTS } from "../prompts/systemPrompts.js";

// Clean and filter valid non-empty API keys
const apiKeys = [
  env.GEMINI_API_KEY_1,
  env.GEMINI_API_KEY_2,
  env.GEMINI_API_KEY_3,
  env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY,
].filter((key) => key && key.trim().length > 0);

let currentKeyIndex = 0;
const MODEL_NAME = "gemini-2.0-flash";

// Get AI Client instance dynamically
const getAIClient = () => {
  if (apiKeys.length === 0) {
    throw new Error("No valid Gemini API keys found in environment variables.");
  }
  const activeKey = apiKeys[currentKeyIndex % apiKeys.length];
  return new GoogleGenAI({ apiKey: activeKey });
};

// Rotate key on 429 rate limit
const rotateKey = () => {
  if (apiKeys.length > 1) {
    currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
    console.warn(`[Gemini API] Switching to Key Index #${currentKeyIndex + 1}`);
  }
};

// Execute request with retry mechanism
const executeWithRetry = async (fn, retries = apiKeys.length || 3, delay = 1500) => {
  try {
    return await fn(getAIClient());
  } catch (error) {
    const isRateLimit =
      error.status === 429 ||
      error.message?.includes("429") ||
      error.message?.includes("RESOURCE_EXHAUSTED");

    if (isRateLimit && retries > 0) {
      console.warn(`[Gemini API 429 Rate Limit] Retrying with next key... (${retries} retries left)`);
      rotateKey();
      await new Promise((res) => setTimeout(res, delay));
      return executeWithRetry(fn, retries - 1, delay);
    }
    throw error;
  }
};

// Build conversation history
const buildConversation = (
  message,
  history = [],
  memories = [],
  intent,
  file = null,
  fileType = null
) => {
  const engine = aiToolRouter(intent);
  const systemPrompt = engine?.prompt || SYSTEM_PROMPTS.general;

  const memoryPrompt =
    memories.length > 0
      ? `\nKnown facts about this user:\n${memories.map((m) => `- ${m.memory_key}: ${m.memory_value}`).join("\n")}\n`
      : "";

  const geminiHistory = history.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content || "" }],
  }));

  const currentParts = [];

  if (file) {
    const base64Data = file.includes(",") ? file.split(",")[1] : file;
    currentParts.push({
      inlineData: {
        data: base64Data,
        mimeType: fileType || "image/png",
      },
    });
  }

  if (message) {
    currentParts.push({ text: message });
  }

  return [
    {
      role: "user",
      parts: [{ text: `\n${systemPrompt}\n\n${memoryPrompt}\n` }],
    },
    ...geminiHistory,
    {
      role: "user",
      parts: currentParts,
    },
  ];
};

// Title Generator
export const generateConversationTitle = async (message) => {
  try {
    const textPrompt = message || "Image analysis conversation";

    const response = await executeWithRetry((aiClient) =>
      aiClient.models.generateContent({
        model: MODEL_NAME,
        contents: `Generate a short conversation title (max 5 words, no quotes): ${textPrompt}`,
      })
    );

    return response.text?.trim() || textPrompt.substring(0, 40);
  } catch (err) {
    console.error("Title Generation Error:", err.message);
    return message ? message.substring(0, 40) : "New Chat";
  }
};

// Normal Chat
export const chatWithAI = async (
  message,
  history = [],
  memories = [],
  file = null,
  fileType = null
) => {
  const intent = detectIntent(message || "");
  const conversation = buildConversation(message, history, memories, intent, file, fileType);

  const response = await executeWithRetry((aiClient) =>
    aiClient.models.generateContent({
      model: MODEL_NAME,
      contents: conversation,
    })
  );

  return { intent, text: response.text };
};

// Streaming Chat
export const chatWithAIStream = async (
  message,
  history = [],
  memories = [],
  file = null,
  fileType = null
) => {
  const intent = detectIntent(message || "");
  const conversation = buildConversation(message, history, memories, intent, file, fileType);

  const stream = await executeWithRetry((aiClient) =>
    aiClient.models.generateContentStream({
      model: MODEL_NAME,
      contents: conversation,
    })
  );

  return { intent, stream };
};