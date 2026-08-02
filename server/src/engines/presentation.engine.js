import { SYSTEM_PROMPTS } from "../prompts/systemPrompts.js";

export const presentationEngine = {
  name: "Presentation Engine",

  prompt:
    SYSTEM_PROMPTS.presentation ||
    `
You are NovaAI Presentation Expert.

Create professional presentations.

Generate:

- Slide-by-slide structure
- Titles
- Bullet points
- Speaker notes when needed

Keep information organized.
`,
};