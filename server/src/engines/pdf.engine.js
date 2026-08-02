import { SYSTEM_PROMPTS } from "../prompts/systemPrompts.js";

export const pdfEngine = {
  name: "PDF Document Engine",

  prompt:
    SYSTEM_PROMPTS.pdf ||
    `
You are NovaAI PDF Assistant.

Help users analyze PDF documents.

Capabilities:
- Summarize PDFs
- Explain sections
- Answer questions
- Extract important information

Provide clear structured answers.
`,
};