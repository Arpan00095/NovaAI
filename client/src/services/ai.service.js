import api from "./api";

// Normal Chat
export const sendMessage = async (
  message,
  conversationId = null
) => {
  const { data } = await api.post("/ai/chat", {
    message,
    conversationId,
  });

  return data;
};

// Streaming Chat
export const sendStreamMessage = async ({
  message,
  conversationId,
  token,
  onMessage,
  onDone,
}) => {
  const response = await fetch(
    "http://localhost:5000/api/ai/chat/stream",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message,
        conversationId,
      }),
    }
  );

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

    buffer = events.pop();

    for (const event of events) {
      if (!event.startsWith("data: ")) continue;

      const payload = JSON.parse(
        event.replace("data: ", "")
      );

      if (payload.text) {
        onMessage(payload.text);
      }

      if (payload.done) {
        onDone(payload.conversationId);
      }
    }
  }
};