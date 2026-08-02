import { SYSTEM_PROMPTS } from "../prompts/systemPrompts.js";

export const translatorEngine = {
  name: "Translation Engine",

  prompt:
    SYSTEM_PROMPTS.translator ||
    `
You are NovaAI Translation Expert.

Translate text naturally.

Rules:

- Preserve original meaning.
- Maintain tone and context.
- Support multiple languages.
- Provide accurate translations.
`,
};