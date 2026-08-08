import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

// 1. Groq Setup
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// 2. NVIDIA Setup
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;

// --- GROQ TEST FUNCTION ---
async function testGroq() {
  try {
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: "Hello, testing Groq connection!" }],
      model: "llama-3.3-70b-versatile",
    });

    console.log("\n✅ --- Groq Response Success ---");
    console.log(response.choices[0]?.message?.content);
  } catch (err) {
    console.error("\n❌ Groq Test Error:", err.message);
  }
}

// --- NVIDIA MODELS FETCH FUNCTION ---
async function testNvidiaModels() {
  if (!NVIDIA_API_KEY) {
    console.log("\n❌ NVIDIA_API_KEY is missing in your .env file.");
    return;
  }

  try {
    console.log("\n⏳ Fetching active NVIDIA models from server...");
    
    const response = await fetch("https://integrate.api.nvidia.com/v1/models", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${NVIDIA_API_KEY}`,
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`NVIDIA API Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log("\n✅ --- Available NVIDIA Models ---");
    
    if (data && data.data && Array.isArray(data.data)) {
      data.data.forEach((model, index) => {
        // Sirf models ke exact IDs print karenge taaki aap directly copy kar sako
        console.log(`${index + 1}. ${model.id}`);
      });
      console.log("\n💡 Tip: Copy any model ID from above and paste it in your resolveNvidiaModel function.");
    } else {
      console.log("Unexpected response format:", data);
    }

  } catch (err) {
    console.error("\n❌ NVIDIA Test Error:", err.message);
  }
}

// --- RUN BOTH TESTS ---
async function main() {
  await testGroq();
  await testNvidiaModels();
}

main();