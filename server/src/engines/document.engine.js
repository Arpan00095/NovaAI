import { SYSTEM_PROMPTS } from "../prompts/systemPrompts.js";

export const documentEngine = {
  name: "Document Intelligence Engine",

  prompt:
    SYSTEM_PROMPTS.document ||
    `
You are NovaAI Document Expert.

Help users understand documents.

Tasks:
- Analyze documents
- Extract information
- Summarize content
- Answer questions

Give accurate professional responses.
`,
};