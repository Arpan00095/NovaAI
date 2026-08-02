const INTENTS = [

  {
    type: "resume",
    keywords: [
      "resume",
      "cv",
      "ats",
      "cover letter",
      "job",
      "interview",
      "linkedin profile",
    ],
  },


  {
    type: "website",
    keywords: [
      "website",
      "landing page",
      "portfolio",
      "frontend",
      "backend",
      "react app",
      "nextjs",
      "next.js",
      "tailwind",
      "web app",
    ],
  },


  {
    type: "code",
    keywords: [
      "code",
      "bug",
      "debug",
      "fix error",
      "javascript",
      "typescript",
      "python",
      "java",
      "c++",
      "react",
      "node",
      "express",
      "algorithm",
      "api",
      "function",
      "component",
    ],
  },


  {
    type: "sql",
    keywords: [
      "sql",
      "mysql",
      "postgres",
      "postgresql",
      "database",
      "query",
      "join",
      "table",
      "schema",
    ],
  },


  {
    type: "pdf",
    keywords: [
      "pdf",
      "analyze pdf",
      "read pdf",
      "explain pdf",
      "pdf summary",
      "pdf document",
    ],
  },


  {
    type: "document",
    keywords: [
      "document",
      "doc",
      "docx",
      "word file",
      "extract text",
      "analyze document",
      "document analysis",
    ],
  },


  {
    type: "grammar",
    keywords: [
      "grammar",
      "correct",
      "rewrite",
      "improve writing",
      "fix sentence",
      "proofread",
    ],
  },


  {
    type: "email",
    keywords: [
      "email",
      "mail",
      "professional email",
      "cold email",
      "follow up",
      "follow-up",
    ],
  },


  {
    type: "blog",
    keywords: [
      "blog",
      "article",
      "seo",
      "content",
      "post",
      "write blog",
    ],
  },


  {
    type: "summary",
    keywords: [
      "summary",
      "summarize",
      "summarise",
      "short",
      "brief",
      "tldr",
    ],
  },


  {
    type: "translator",
    keywords: [
      "translate",
      "translation",
      "english",
      "hindi",
      "french",
      "spanish",
      "convert language",
    ],
  },


  {
    type: "image",
    keywords: [
      "image",
      "logo",
      "poster",
      "banner",
      "generate image",
      "image prompt",
      "midjourney",
      "stable diffusion",
      "design image",
    ],
  },


  {
    type: "presentation",
    keywords: [
      "presentation",
      "ppt",
      "slides",
      "powerpoint",
      "make slides",
      "create presentation",
    ],
  },

];


export const detectIntent = (message = "") => {

  const prompt = message.toLowerCase();


  for (const intent of INTENTS) {

    const matched =
      intent.keywords.some((keyword) =>
        prompt.includes(keyword)
      );


    if (matched) {
      return intent.type;
    }

  }


  return "general";
};