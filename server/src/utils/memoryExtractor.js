export const extractMemory = (message) => {
  const text = message.trim();

  const patterns = [
    {
      key: "name",
      regex: /(?:my name is|i am|i'm)\s+([a-zA-Z ]{2,40})$/i,
    },
    {
      key: "profession",
      regex:
        /(?:i am a|i work as a|i'm a)\s+([a-zA-Z ]{2,50})$/i,
    },
    {
      key: "project",
      regex:
        /(?:my project is|i am building|i'm building)\s+(.+)/i,
    },
    {
      key: "language",
      regex:
        /(?:i speak|my language is)\s+(.+)/i,
    },
    {
      key: "location",
      regex:
        /(?:i live in|i am from)\s+(.+)/i,
    },
  ];

  const memories = [];

  for (const pattern of patterns) {
    const match = text.match(pattern.regex);

    if (match) {
      memories.push({
        key: pattern.key,
        value: match[1].trim(),
      });
    }
  }

  return memories;
};