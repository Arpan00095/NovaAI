import { GoogleGenAI } from "@google/genai";

import env from "../config/env.js";

import { detectIntent } from "./intent.service.js";
import { aiToolRouter } from "../router/ai.tool.router.js";
import { SYSTEM_PROMPTS } from "../prompts/systemPrompts.js";

const ai = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

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

  // Current User Request Parts (Text + Optional File/Image)
  const currentParts = [];

  // Agar user ne Image/File upload kiya hai
  if (file) {
    const base64Data = file.includes(",") ? file.split(",")[1] : file;
    currentParts.push({
      inlineData: {
        data: base64Data,
        mimeType: fileType || "image/png",
      },
    });
  }

  // Text message add karein
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

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
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
    });

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

  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: conversation,
  });

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

  const stream = await ai.models.generateContentStream({
    model: "gemini-1.5-flash",
    contents: conversation,
  });

  return {
    intent,
    stream,
  };
};