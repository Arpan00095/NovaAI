import Groq from "groq-sdk";
import env from "../config/env.js";
import { detectIntent } from "./intent.service.js";
import { aiToolRouter } from "../router/ai.tool.router.js";
import { SYSTEM_PROMPTS } from "../prompts/systemPrompts.js";

const groq = new Groq({ apiKey: env.GROQ_API_KEY || process.env.GROQ_API_KEY });

const PRIMARY_TEXT_MODEL = "llama-3.3-70b-versatile";
const PRIMARY_VISION_MODEL = "qwen/qwen3.6-27b";

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

  const fullSystemPrompt = `${systemPrompt}\n${memoryPrompt}\n\nIMPORTANT: Provide direct response only. Do NOT include internal reasoning, thinking steps, or <think> tags.`;

  let selectedModel = PRIMARY_TEXT_MODEL;
  let groqMessages = [
    { role: "system", content: fullSystemPrompt },
    ...history.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content || "",
    })),
  ];

  // If Image/File is attached, switch to vision model
  if (file) {
    selectedModel = PRIMARY_VISION_MODEL;
    console.log(`[AI Engine] Image detected -> Switching to Vision Model: ${selectedModel}`);

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
    groqMessages.push({ role: "user", content: message || "" });
  }

  try {
    const groqStream = await groq.chat.completions.create({
      messages: groqMessages,
      model: selectedModel,
      stream: true,
      max_tokens: 2000,
      temperature: 0.7,
    });

    async function* transformStream() {
      let isThinking = false;
      let buffer = "";

      for await (const chunk of groqStream) {
        const textChunk = chunk.choices[0]?.delta?.content || "";
        if (!textChunk) continue;

        buffer += textChunk;

        // Strip <think>...</think> blocks completely
        while (buffer.length > 0) {
          if (!isThinking) {
            const thinkStart = buffer.indexOf("<think>");
            if (thinkStart !== -1) {
              const textBefore = buffer.slice(0, thinkStart);
              if (textBefore) yield { text: textBefore };
              buffer = buffer.slice(thinkStart + 7);
              isThinking = true;
            } else {
              // Yield buffer safely if no opening tag is forming
              if (!"<think>".startsWith(buffer)) {
                yield { text: buffer };
                buffer = "";
              }
              break;
            }
          } else {
            const thinkEnd = buffer.indexOf("</think>");
            if (thinkEnd !== -1) {
              buffer = buffer.slice(thinkEnd + 8);
              isThinking = false;
            } else {
              buffer = "";
              break;
            }
          }
        }
      }

      if (!isThinking && buffer && !"<think>".startsWith(buffer)) {
        yield { text: buffer };
      }
    }

    return { intent, stream: transformStream() };
  } catch (error) {
    console.error(`Groq API Error on model (${selectedModel}):`, error.message);
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