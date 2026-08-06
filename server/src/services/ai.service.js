import Groq from "groq-sdk";
import env from "../config/env.js";
import { detectIntent } from "./intent.service.js";
import { aiToolRouter } from "../router/ai.tool.router.js";
import { SYSTEM_PROMPTS } from "../prompts/systemPrompts.js";

// Initialize Groq Client Only
const groq = new Groq({ apiKey: env.GROQ_API_KEY || process.env.GROQ_API_KEY });

// Zero API Hit Title Generator
export const generateConversationTitle = async (message) => {
  if (!message || message.trim() === "") return "New Conversation";
  const cleanMessage = message.trim();
  return cleanMessage.length > 30 ? cleanMessage.substring(0, 30) + "..." : cleanMessage;
};

export const chatWithAIStream = async (
  message,
  history = [],
  memories = [],
  file = null,
  fileType = null
) => {
  const intent = detectIntent(message || "");
  const engine = aiToolRouter(intent);
  const systemPrompt = engine?.prompt || SYSTEM_PROMPTS.general;

  const memoryPrompt =
    memories.length > 0
      ? `\nKnown facts about this user:\n${memories.map((m) => `- ${m.memory_key}: ${m.memory_value}`).join("\n")}\n`
      : "";

  const fullSystemPrompt = `${systemPrompt}\n${memoryPrompt}`;

  let selectedModel = "llama-3.3-70b-versatile";
  let groqMessages = [
    { role: "system", content: fullSystemPrompt },
    ...history.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content || "",
    })),
  ];

  // If Image/Photo is uploaded -> Use Groq Active Vision Model
  if (file) {
    selectedModel = "llama-3.2-90b-vision-preview";
    console.log("[AI Engine] Image detected -> Routing via Groq Vision (90b)...");

    const imageUrl = file.startsWith("data:")
      ? file
      : `data:${fileType || "image/png"};base64,${file}`;

    groqMessages.push({
      role: "user",
      content: [
        { type: "text", text: message || "Analyze this image in detail." },
        {
          type: "image_url",
          image_url: { url: imageUrl },
        },
      ],
    });
  } else {
    console.log("[AI Engine] Text prompt -> Routing via Groq Text (70b)...");
    groqMessages.push({ role: "user", content: message || "" });
  }

  try {
    const groqStream = await groq.chat.completions.create({
      messages: groqMessages,
      model: selectedModel,
      stream: true,
      max_tokens: 2000,
    });

    async function* transformStream() {
      for await (const chunk of groqStream) {
        const textChunk = chunk.choices[0]?.delta?.content || "";
        if (textChunk) yield { text: textChunk };
      }
    }

    return { intent, stream: transformStream() };
  } catch (error) {
    console.error("Groq API Error:", error.message);
    throw error;
  }
};

export const chatWithAI = async (message, history = [], memories = [], file = null, fileType = null) => {
  const result = await chatWithAIStream(message, history, memories, file, fileType);
  let text = "";
  for await (const chunk of result.stream) {
    text += chunk.text || "";
  }
  return { intent: result.intent, text };
};