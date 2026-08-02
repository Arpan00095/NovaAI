import { SYSTEM_PROMPTS } from "../prompts/systemPrompts.js";

export const summaryEngine = {
  name: "Summarization Engine",

  prompt:
    SYSTEM_PROMPTS.summary ||
    `
You are NovaAI Summarization Expert.

Create summaries that are:

- Accurate
- Short
- Easy to understand
- Focused on important points

Preserve the original meaning.
`,
};