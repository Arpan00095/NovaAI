import { GoogleGenAI } from "@google/genai";
import env from "../config/env.js";
import { detectIntent } from "./intent.service.js";
import { aiToolRouter } from "../router/ai.tool.router.js";
import { SYSTEM_PROMPTS } from "../prompts/systemPrompts.js";

// Multiple API Keys Pool (4 Keys Supported)
const apiKeys = [
  env.GEMINI_API_KEY_1,
  env.GEMINI_API_KEY_2,
  env.GEMINI_API_KEY_3,
  env.GEMINI_API_KEY_4,
].filter(Boolean); // Only valid non-empty keys keep karega

let currentKeyIndex = 0;

// Helper: Active Key ke sath GoogleGenAI Client return karega
const getAIClient = () => {
  const activeKey = apiKeys[currentKeyIndex % apiKeys.length];
  return new GoogleGenAI({ apiKey: activeKey });
};

// Helper: 429 Rate Limit aane par Next Key par switch karega
const rotateKey = () => {
  if (apiKeys.length > 1) {
    currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
    console.warn(`[Gemini API] Rotating to API Key #${currentKeyIndex + 1}`);
  }
};

const MODEL_NAME = "gemini-2.0-flash";

// -----------------------------
// Auto-Retry & Key Rotation Wrapper
// -----------------------------
const executeWithRetry = async (fn, retries = 3, delay = 1500) => {
  try {
    return await fn(getAIClient());
  } catch (error) {
    const isRateLimit =
      error.status === 429 ||
      error.message?.includes("429") ||
      error.message?.includes("RESOURCE_EXHAUSTED");

    if (isRateLimit && retries > 0) {
      console.warn(
        `[Gemini API Rate Limit 429] Switching key & retrying... (${retries} attempts left)`
      );
      rotateKey();
      await new Promise((res) => setTimeout(res, delay));
      return executeWithRetry(fn, retries - 1, delay);
    }
    throw error;
  }
};

// -----------------------------
// Build Conversation (Multimodal Supported)
// -----------------------------
const buildConversation = (
  message,
  history = [],
  memories = [],
  intent,
  file = null,
  fileType = null
) => {
  const engine = aiToolRouter(intent);

  const systemPrompt =
    engine?.prompt || SYSTEM_PROMPTS.general;

  const memoryPrompt =
    memories.length > 0
      ? `
Known facts about this user:

${memories
  .map(
    (m) =>
      `- ${m.memory_key}: ${m.memory_value}`
  )
  .join("\n")}

Use these facts whenever they are relevant.

Do not mention these memories unless the user asks or they naturally help answer the question.
`
      : "";

  const geminiHistory = history.map((msg) => ({
    role:
      msg.role === "assistant"
        ? "model"
        : "user",

    parts: [
      {
        text: msg.content || "",
      },
    ],
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
    currentParts.push({
      text: message,
    });
  }

  return [
    {
      role: "user",
      parts: [
        {
          text: `
${systemPrompt}

${memoryPrompt}
`,
        },
      ],
    },

    ...geminiHistory,

    {
      role: "user",
      parts: currentParts,
    },
  ];
};

// -----------------------------
// Generate Conversation Title
// -----------------------------
export const generateConversationTitle = async (message) => {
  try {
    const textPrompt = message || "Image analysis conversation";

    const response = await executeWithRetry((aiClient) =>
      aiClient.models.generateContent({
        model: MODEL_NAME,
        contents: `
Generate a very short conversation title.

Rules:
- Maximum 5 words
- No quotes
- No punctuation at the end
- Capitalize naturally
- Return ONLY the title

User Message:
${textPrompt}
`,
      })
    );

    return (
      response.text?.trim() ||
      textPrompt.substring(0, 40)
    );
  } catch (err) {
    console.error(
      "Title Generation Error:",
      err.message
    );

    return message ? message.substring(0, 40) : "New Chat";
  }
};

// -----------------------------
// Normal Chat (Multimodal)
// -----------------------------
export const chatWithAI = async (
  message,
  history = [],
  memories = [],
  file = null,
  fileType = null
) => {
  const intent = detectIntent(message || "");

  const conversation = buildConversation(
    message,
    history,
    memories,
    intent,
    file,
    fileType
  );

  const response = await executeWithRetry((aiClient) =>
    aiClient.models.generateContent({
      model: MODEL_NAME,
      contents: conversation,
    })
  );

  return {
    intent,
    text: response.text,
  };
};

// -----------------------------
// Streaming Chat (Multimodal)
// -----------------------------
export const chatWithAIStream = async (
  message,
  history = [],
  memories = [],
  file = null,
  fileType = null
) => {
  const intent = detectIntent(message || "");

  const conversation = buildConversation(
    message,
    history,
    memories,
    intent,
    file,
    fileType
  );

  const stream = await executeWithRetry((aiClient) =>
    aiClient.models.generateContentStream({
      model: MODEL_NAME,
      contents: conversation,
    })
  );

  return {
    intent,
    stream,
  };
};