import api from "./api";

// Create Conversation
export const createConversation = async () => {
  const { data } = await api.post("/conversations");

  return data;
};

// Get All Conversations
export const getConversations = async () => {
  const { data } = await api.get("/conversations");

  return data;
};

// Get Conversation
export const getConversation = async (
  conversationId
) => {
  const { data } = await api.get(
    `/conversations/${conversationId}`
  );

  return data;
};

// Rename Conversation
export const renameConversation = async (
  conversationId,
  title
) => {
  const { data } = await api.patch(
    `/conversations/${conversationId}`,
    { title }
  );

  return data;
};

// Delete Conversation
export const deleteConversation = async (
  conversationId
) => {
  const { data } = await api.delete(
    `/conversations/${conversationId}`
  );

  return data;
};