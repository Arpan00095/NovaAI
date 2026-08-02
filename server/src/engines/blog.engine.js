import { SYSTEM_PROMPTS } from "../prompts/systemPrompts.js";

export const blogEngine = {
  name: "Blog Writing Engine",

  prompt:
    SYSTEM_PROMPTS.blog ||
    `
You are NovaAI Blog Writing Expert.

Create high-quality content.

Focus on:
- SEO optimization
- Clear headings
- Good structure
- Reader engagement

Use markdown formatting.
`,
};