import Groq from "groq-sdk";
import env from "../config/env.js";
import { detectIntent } from "./intent.service.js";
import { aiToolRouter } from "../router/ai.tool.router.js";
import { SYSTEM_PROMPTS } from "../prompts/systemPrompts.js";

// Initialize Groq Client
const groq = new Groq({ apiKey: env.GROQ_API_KEY || process.env.GROQ_API_KEY });
const MODEL_NAME = "llama-3.3-70b-versatile";

// Zero API Hit Title Generator
export const generateConversationTitle = async (message) => {
  if (!message || message.trim() === "") return "New Conversation";
  const cleanMessage = message.trim();
  return cleanMessage.length > 30 ? cleanMessage.substring(0, 30) + "..." : cleanMessage;
};

// Builder for Groq Messages format
const buildGroqMessages = (message, history = [], memories = [], intent) => {
  const engine = aiToolRouter(intent);
  const systemPrompt = engine?.prompt || SYSTEM_PROMPTS.general;

  const memoryPrompt =
    memories.length > 0
      ? `\nKnown facts about this user:\n${memories.map((m) => `- ${m.memory_key}: ${m.memory_value}`).join("\n")}\n`
      : "";

  const fullSystemPrompt = `${systemPrompt}\n${memoryPrompt}`;

  const groqMessages = [
    { role: "system", content: fullSystemPrompt },
    ...history.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content || "",
    })),
  ];

  if (message) {
    groqMessages.push({ role: "user", content: message });
  }

  return groqMessages;
};

// Streaming Chat (Groq)
export const chatWithAIStream = async (
  message,
  history = [],
  memories = [],
  file = null,
  fileType = null
) => {
  // Groq abhi image natively waise support nahi karta jaise Gemini, 
  // isliye agar file aati hai toh abhi ke liye text ko hi prefer karenge.
  if (file) {
    console.warn("Groq currently does not support Gemini-style image inline data natively. Processing text only.");
  }

  const intent = detectIntent(message || "");
  const messages = buildGroqMessages(message, history, memories, intent);

  try {
    const groqStream = await groq.chat.completions.create({
      messages: messages,
      model: MODEL_NAME,
      stream: true,
      temperature: 0.7,
      max_tokens: 2000,
    });

    // Adapter for controller to keep format same as Gemini stream
    async function* transformStream() {
      for await (const chunk of groqStream) {
        const textChunk = chunk.choices[0]?.delta?.content || "";
        if (textChunk) {
          yield { text: textChunk };
        }
      }
    }

    return { intent, stream: transformStream() };
  } catch (error) {
    console.error("Groq API Error:", error.message);
    throw error;
  }
};

// Normal Chat (Groq)
export const chatWithAI = async (
  message,
  history = [],
  memories = [],
  file = null,
  fileType = null
) => {
  if (file) {
    console.warn("Groq currently does not support Gemini-style image inline data natively. Processing text only.");
  }

  const intent = detectIntent(message || "");
  const messages = buildGroqMessages(message, history, memories, intent);

  try {
    const response = await groq.chat.completions.create({
      messages: messages,
      model: MODEL_NAME,
      stream: false,
      temperature: 0.7,
      max_tokens: 2000,
    });

    return { intent, text: response.choices[0]?.message?.content || "" };
  } catch (error) {
    console.error("Groq API Error:", error.message);
    throw error;
  }
};