import { GoogleGenAI } from "@google/genai";

import env from "../config/env.js";

import { detectIntent } from "./intent.service.js";
import { aiToolRouter } from "../router/ai.tool.router.js";
import { SYSTEM_PROMPTS } from "../prompts/systemPrompts.js";

const ai = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});


// -----------------------------
// Build Conversation
// -----------------------------
const buildConversation = (
  message,
  history = [],
  memories = [],
  intent
) => {

  // AI Tool Router
  const engine = aiToolRouter(intent);

  const systemPrompt =
    engine?.prompt ||
    SYSTEM_PROMPTS.general;


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
        text: msg.content,
      },
    ],
  }));


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

      parts: [
        {
          text: message,
        },
      ],
    },
  ];
};



// -----------------------------
// Normal Chat
// -----------------------------
export const chatWithAI = async (
  message,
  history = [],
  memories = []
) => {

  const intent =
    detectIntent(message);


  const conversation =
    buildConversation(
      message,
      history,
      memories,
      intent
    );


  const response =
    await ai.models.generateContent({

      model: "gemini-flash-latest",

      contents: conversation,

    });


  return {

    intent,

    text: response.text,

  };
};



// -----------------------------
// Streaming Chat
// -----------------------------
export const chatWithAIStream =
  async (
    message,
    history = [],
    memories = []
  ) => {


    const intent =
      detectIntent(message);



    const conversation =
      buildConversation(
        message,
        history,
        memories,
        intent
      );



    const stream =
      await ai.models.generateContentStream({

        model: "gemini-flash-latest",

        contents: conversation,

      });



    return {

      intent,

      stream,

    };

  };