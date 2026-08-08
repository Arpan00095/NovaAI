import api from "./api";

// -----------------------------
// Normal Chat (Supports Text + File + Model Routing)
// -----------------------------
export const sendMessage = async (
  message,
  file = null,
  fileType = null,
  conversationId = null,
  model = "groq-llama" // Selected model fallback
) => {
  const { data } = await api.post("/ai/chat", {
    message,
    file,
    fileType,
    conversationId,
    model, // Backend ko model batayega
  });

  return data;
};

// -----------------------------
// Streaming Chat (Supports Text + File + Model Routing)
// -----------------------------
export const sendStreamMessage = async ({
  message,
  file = null,
  fileType = null,
  conversationId,
  model = "groq-llama", // Context API se model receive hoga
  token,
  onMessage,
  onDone,
  onImage,
}) => {
  const response = await fetch(`${api.defaults.baseURL}/ai/chat/stream`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      message,
      file,            // Base64 image data
      fileType,        // Image mime type (e.g., image/png)
      conversationId,
      model,           // <-- IMPORTANT: Model pass ho raha hai (nvidia-auto / nvidia-340b)
    }),
  });

  if (!response.ok) {
    throw new Error("Streaming failed");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    buffer += decoder.decode(value, {
      stream: true,
    });

    const events = buffer.split("\n\n");

    buffer = events.pop() || "";

    for (const event of events) {
      if (!event.startsWith("data: ")) continue;

      const payload = JSON.parse(event.replace("data: ", ""));

      // Streaming Text
      if (payload.text && onMessage) {
        onMessage(payload.text);
      }

      // Image Response
      if (payload.image && onImage) {
        onImage(payload.image);
      }

      // Server Error
      if (payload.error) {
        throw new Error(payload.error);
      }

      // Stream Finished
      if (payload.done && onDone) {
        onDone(payload.conversationId);
      }
    }
  }
};