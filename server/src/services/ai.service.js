import Groq from "groq-sdk";
import env from "../config/env.js";
import { detectIntent } from "./intent.service.js";
import { aiToolRouter } from "../router/ai.tool.router.js";
import { SYSTEM_PROMPTS } from "../prompts/systemPrompts.js";

const groq = new Groq({ apiKey: env.GROQ_API_KEY || process.env.GROQ_API_KEY });
const NVIDIA_API_KEY = env.NVIDIA_API_KEY || process.env.NVIDIA_API_KEY;
const NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

const PRIMARY_TEXT_MODEL = "llama-3.3-70b-versatile";
const PRIMARY_VISION_MODEL = "qwen/qwen3.6-27b";

export const generateConversationTitle = async (message) => {
  if (!message || message.trim() === "") return "New Conversation";
  const cleanMessage = message.trim();
  return cleanMessage.length > 30 ? cleanMessage.substring(0, 30) + "..." : cleanMessage;
};

// ====================================================
// Smart model selector for NVIDIA API (FAST & HEAVY)
// ====================================================
const resolveNvidiaModel = (modelId, promptText) => {
  // Ultra Mode (Heavy Logic & Coding - Top Tier Model)
  if (modelId === "nvidia-340b") {
    return "mistralai/mistral-large-2-instruct"; 
  }
  
  // Auto Mode (Balances Super-Fast Speed and High IQ)
  if (modelId === "nvidia-auto") {
    const isComplex =
      /3d|three\.js|webgl|shader|canvas|system architecture|complex logic|algorithm|react native/i.test(promptText) ||
      promptText.length > 600;
      
    return isComplex
      ? "mistralai/mistral-large-2-instruct"       // Heavy prompts ke liye Flagship Model
      : "nv-mistralai/mistral-nemo-12b-instruct";  // Quick prompts ke liye Lightning Fast Model
  }
  
  // Default Fallback
  return "nv-mistralai/mistral-nemo-12b-instruct";
};

export const chatWithAIStream = async (
  message,
  history = [],
  memories = [],
  file = null,
  fileType = null,
  selectedModel = "groq-llama"
) => {
  const intent = detectIntent(message || "");
  const engine = aiToolRouter(intent);
  const systemPrompt = engine?.prompt || SYSTEM_PROMPTS.general;

  const memoryPrompt =
    memories.length > 0
      ? `\nKnown facts about this user:\n${memories.map((m) => `- ${m.memory_key}: ${m.memory_value}`).join("\n")}\n`
      : "";

  const fullSystemPrompt = `${systemPrompt}\n${memoryPrompt}\n\nIMPORTANT: Provide direct response only. Do NOT include internal reasoning, thinking steps, or <think> tags.`;

  // Base Messages Array
  let formattedMessages = [
    { role: "system", content: fullSystemPrompt },
    ...history.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content || "",
    })),
  ];

  if (file) {
    const imageUrl = file.startsWith("data:")
      ? file
      : `data:${fileType || "image/png"};base64,${file}`;

    formattedMessages.push({
      role: "user",
      content: [
        { type: "text", text: message || "Analyze this image in detail." },
        { type: "image_url", image_url: { url: imageUrl } },
      ],
    });
  } else {
    formattedMessages.push({ role: "user", content: message || "" });
  }

  // ====================================================
  // ENGINE ROUTING: NVIDIA NEMOTRON vs GROQ
  // ====================================================

  if (selectedModel.startsWith("nvidia")) {
    const targetNvidiaModel = resolveNvidiaModel(selectedModel, message || "");
    
    console.log(`🚀 [NVIDIA ENGINE TRIGGERED] -> Model: ${targetNvidiaModel}`);

    const response = await fetch(NVIDIA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${NVIDIA_API_KEY}`,
      },
      body: JSON.stringify({
        model: targetNvidiaModel,
        messages: formattedMessages,
        temperature: 0.2,
        max_tokens: 8192, // 💥 FIXED: Badha kar 8192 kar diya taaki lamba code kabhi na kate
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`NVIDIA API Error: ${response.statusText}`);
    }

    // Process NVIDIA Stream Engine
    async function* transformNvidiaStream() {
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data: ") && trimmed !== "data: [DONE]") {
            try {
              const parsed = JSON.parse(trimmed.slice(6));
              const textChunk = parsed.choices[0]?.delta?.content || "";
              if (textChunk) yield { text: textChunk };
            } catch (err) {
              // Ignore partial JSON chunks
            }
          }
        }
      }
    }

    return { intent, stream: transformNvidiaStream() };
  }

  // DEFAULT ENGINE: GROQ
  let activeGroqModel = file ? PRIMARY_VISION_MODEL : PRIMARY_TEXT_MODEL;

  try {
    const groqStream = await groq.chat.completions.create({
      messages: formattedMessages,
      model: activeGroqModel,
      stream: true,
      max_tokens: 4096, // GROQ ke liye bhi thoda badha diya
      temperature: 0.7,
    });

    async function* transformGroqStream() {
      let isThinking = false;
      let buffer = "";

      for await (const chunk of groqStream) {
        const textChunk = chunk.choices[0]?.delta?.content || "";
        if (!textChunk) continue;

        buffer += textChunk;

        while (buffer.length > 0) {
          if (!isThinking) {
            const thinkStart = buffer.indexOf("<think>");
            if (thinkStart !== -1) {
              const textBefore = buffer.slice(0, thinkStart);
              if (textBefore) yield { text: textBefore };
              buffer = buffer.slice(thinkStart + 7);
              isThinking = true;
            } else {
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

    return { intent, stream: transformGroqStream() };
  } catch (error) {
    console.error(`Groq API Error on model (${activeGroqModel}):`, error.message);
    throw error;
  }
};

export const chatWithAI = async (
  message,
  history = [],
  memories = [],
  file = null,
  fileType = null,
  selectedModel = "groq-llama"
) => {
  const result = await chatWithAIStream(message, history, memories, file, fileType, selectedModel);
  let text = "";
  for await (const chunk of result.stream) {
    text += chunk.text || "";
  }
  return { intent: result.intent, text };
};