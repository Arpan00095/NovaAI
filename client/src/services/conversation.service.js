import api from "./api";

// ==========================
// Create Conversation
// ==========================

export const createConversation = async () => {
  const { data } = await api.post("/conversations");
  return data;
};

// ==========================
// Get All Conversations
// ==========================

export const getConversations = async () => {
  const { data } = await api.get("/conversations");
  return data;
};

// ==========================
// Get Conversation
// ==========================

export const getConversation = async (
  conversationId
) => {
  const { data } = await api.get(
    `/conversations/${conversationId}`
  );

  return data;
};

// ==========================
// Rename Conversation
// ==========================

export const renameConversation = async (
  conversationId,
  title
) => {
  const { data } = await api.patch(
    `/conversations/${conversationId}`,
    {
      title,
    }
  );

  return data;
};

// ==========================
// Delete Conversation
// ==========================

export const deleteConversation = async (
  conversationId
) => {
  const { data } = await api.delete(
    `/conversations/${conversationId}`
  );

  return data;
};

// ==========================
// Pin / Unpin Conversation
// ==========================

export const togglePinConversation = async (
  conversationId,
  isPinned
) => {
  const { data } = await api.patch(
    `/conversations/${conversationId}/pin`,
    {
      isPinned,
    }
  );

  return data;
};

// ==========================
// Share Conversation
// ==========================

export const shareConversation = async (
  conversationId
) => {
  const { data } = await api.post(
    `/conversations/${conversationId}/share`
  );

  return data;
};

// ==========================
// Get Shared Conversation
// ==========================

export const getSharedConversation = async (
  shareToken
) => {
  const { data } = await api.get(
    `/conversations/share/${shareToken}`
  );

  return data;
};

// ==========================
// Archive Conversation
// ==========================

export const archiveConversation = async (
  conversationId,
  isArchived
) => {
  const { data } = await api.patch(
    `/conversations/${conversationId}/archive`,
    {
      isArchived,
    }
  );

  return data;
};