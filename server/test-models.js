import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function main() {
  try {
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: "Hello, testing Groq connection!" }],
      model: "llama-3.3-70b-versatile",
    });

    console.log("\n--- Groq Response Success ---");
    console.log(response.choices[0]?.message?.content);
  } catch (err) {
    console.error("Groq Test Error:", err.message);
  }
}

main();