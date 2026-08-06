import { GoogleGenAI } from "@google/genai";
import env from "../config/env.js";
import { detectIntent } from "./intent.service.js";
import { aiToolRouter } from "../router/ai.tool.router.js";
import { SYSTEM_PROMPTS } from "../prompts/systemPrompts.js";

// Clean API Keys Array
const rawKeys = [
  env.GEMINI_API_KEY_1,
  env.GEMINI_API_KEY_2,
  env.GEMINI_API_KEY_3,
  env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY,
];

const apiKeys = [...new Set(rawKeys)].filter(
  (key) => key && typeof key === "string" && key.trim().length > 10
);

let currentKeyIndex = 0;
const MODEL_NAME = "gemini-2.0-flash";

const getAIClient = () => {
  if (apiKeys.length === 0) {
    throw new Error("No valid Gemini API key found!");
  }
  const activeKey = apiKeys[currentKeyIndex % apiKeys.length];
  return new GoogleGenAI({ apiKey: activeKey });
};

const rotateKey = () => {
  if (apiKeys.length > 1) {
    currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
    console.warn(`[Gemini API] Switched to Key Index #${(currentKeyIndex % apiKeys.length) + 1}`);
  }
};

const executeWithRetry = async (fn, retries = apiKeys.length || 3, delay = 2000) => {
  try {
    return await fn(getAIClient());
  } catch (error) {
    const isRateLimit =
      error.status === 429 ||
      error.message?.includes("429") ||
      error.message?.includes("RESOURCE_EXHAUSTED");

    if (isRateLimit && retries > 0) {
      console.warn(`[Gemini API 429] Rotating key and retrying... (${retries} attempts left)`);
      rotateKey();
      await new Promise((res) => setTimeout(res, delay));
      return executeWithRetry(fn, retries - 1, delay);
    }
    throw error;
  }
};

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

// FAST TITLE GENERATOR (No extra Gemini API call = Zero extra load!)
export const generateConversationTitle = async (message) => {
  if (!message || message.trim() === "") return "New Conversation";
  const cleanMessage = message.trim();
  return cleanMessage.length > 30 
    ? cleanMessage.substring(0, 30) + "..." 
    : cleanMessage;
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