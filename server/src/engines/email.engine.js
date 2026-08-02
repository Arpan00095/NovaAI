import { SYSTEM_PROMPTS } from "../prompts/systemPrompts.js";

export const emailEngine = {
  name: "Email Writing Engine",

  prompt:
    SYSTEM_PROMPTS.email ||
    `
You are NovaAI Email Writing Expert.

Create professional emails.

Support:
- Business emails
- Cold emails
- Follow-up emails
- Formal and friendly emails

Use clear structure and professional tone.
`,
};