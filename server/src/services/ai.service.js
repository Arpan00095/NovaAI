import Groq from "groq-sdk";
import env from "../config/env.js";
import { detectIntent } from "./intent.service.js";
import { aiToolRouter } from "../router/ai.tool.router.js";
import { SYSTEM_PROMPTS } from "../prompts/systemPrompts.js";

const groq = new Groq({ apiKey: env.GROQ_API_KEY || process.env.GROQ_API_KEY });
const NVIDIA_API_KEY = env.NVIDIA_API_KEY || process.env.NVIDIA_API_KEY;
const NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

const PRIMARY_TEXT_MODEL = "llama-3.3-70b-versatile";

export const generateConversationTitle = async (message) => {
  if (!message || message.trim() === "") return "New Conversation";
  const cleanMessage = message.trim();
  return cleanMessage.length > 30 ? cleanMessage.substring(0, 30) + "..." : cleanMessage;
};

// ====================================================
// Smart model selector for NVIDIA API (Stable & Vision)
// ====================================================
const resolveNvidiaModel = (modelId, promptText, hasImage = false) => {
  // 📸 Agar image upload hui hai, toh NVIDIA ka powerful 90B Vision model use hoga
  if (hasImage) {
    return "meta/llama-3.2-90b-vision-instruct"; 
  }

  // 🧠 Ultra Mode (Heavy Logic & Coding)
  if (modelId === "nvidia-340b") {
    return "meta/llama-3.1-70b-instruct"; 
  }
  
  // ⚡ Auto Mode (Text Only)
  if (modelId === "nvidia-auto") {
    const isComplex =
      /3d|three\.js|webgl|shader|canvas|system architecture|complex logic|algorithm|react native/i.test(promptText) ||
      promptText.length > 600;
      
    return isComplex
      ? "meta/llama-3.1-70b-instruct"    
      : "meta/llama-3.1-8b-instruct";    
  }
  
  return "meta/llama-3.1-8b-instruct";
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
  // SMART ROUTING: Agar photo hai, toh automatically NVIDIA Vision engine use hoga
  // ====================================================
  const shouldUseNvidia = selectedModel.startsWith("nvidia") || !!file;

  if (shouldUseNvidia) {
    const targetNvidiaModel = resolveNvidiaModel(selectedModel, message || "", !!file);
    
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
        max_tokens: 4096,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`NVIDIA API Error: ${response.statusText} - ${errText}`);
    }

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

  // ====================================================
  // DEFAULT ENGINE: GROQ (Pure Text Only)
  // ====================================================
  try {
    const groqStream = await groq.chat.completions.create({
      messages: formattedMessages,
      model: PRIMARY_TEXT_MODEL,
      stream: true,
      max_tokens: 4096,
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
    console.error(`Groq API Error on model (${PRIMARY_TEXT_MODEL}):`, error.message);
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