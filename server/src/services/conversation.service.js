import supabase from "../config/supabase.js";

// Create Conversation
export const createConversation = async (
  userId,
  title = "New Chat"
) => {
  try {
    const { data, error } = await supabase
      .from("conversations")
      .insert({
        user_id: userId,
        title,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    console.error("FULL ERROR:");
    console.error(err);
    throw err;
  }
};

// Save Message (Updated to handle image_url)
export const saveMessage = async (
  conversationId,
  role,
  content,
  imageUrl = null // Yahan hum optional imageUrl receive kar rahe hain
) => {
  const { data, error } = await supabase
    .from("conversation_messages")
    .insert({
      conversation_id: conversationId,
      role,
      content,
      image_url: imageUrl, // Aur yahan table column me save kar rahe hain
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Get Conversation Messages
export const getConversationMessages = async (
  conversationId
) => {
  const { data, error } = await supabase
    .from("conversation_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Get User Conversations
export const getUserConversations = async (
  userId
) => {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", userId)
    .order("is_pinned", {
      ascending: false,
    })
    .order("updated_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Update Conversation Title
export const updateConversationTitle = async (
  conversationId,
  title
) => {
  const { data, error } = await supabase
    .from("conversations")
    .update({
      title,
      updated_at: new Date().toISOString(),
    })
    .eq("id", conversationId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Delete Conversation
export const deleteConversation = async (
  conversationId
) => {
  const { error } = await supabase
    .from("conversations")
    .delete()
    .eq("id", conversationId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

// Get Conversation Messages by ID
export const getConversationById = async (
  conversationId
) => {
  const { data, error } = await supabase
    .from("conversation_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Get Conversation with User Ownership Check
export const getConversation = async (
  conversationId,
  userId
) => {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .eq("user_id", userId)
    .single();

  if (error) {
    throw new Error("Conversation not found");
  }

  return data;
};

// Update Conversation Timestamp
export const touchConversation = async (
  conversationId
) => {
  const { error } = await supabase
    .from("conversations")
    .update({
      updated_at: new Date().toISOString(),
    })
    .eq("id", conversationId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

// Toggle Pin Conversation
export const togglePinConversation = async (
  conversationId,
  isPinned
) => {
  const { data, error } = await supabase
    .from("conversations")
    .update({
      is_pinned: isPinned,
      updated_at: new Date().toISOString(),
    })
    .eq("id", conversationId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// ==========================
// Archive / Restore Conversation
// ==========================
export const toggleArchiveConversation = async (
  conversationId,
  isArchived
) => {
  const { data, error } = await supabase
    .from("conversations")
    .update({
      is_archived: isArchived,
      updated_at: new Date().toISOString(),
    })
    .eq("id", conversationId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// ======================================
// Create Share Token
// ======================================
export const createShareToken = async (
  conversationId,
  shareToken
) => {
  const { data, error } = await supabase
    .from("conversations")
    .update({
      share_token: shareToken,
      updated_at: new Date().toISOString(),
    })
    .eq("id", conversationId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// ======================================
// Get Shared Conversation
// ======================================
export const getConversationByShareToken = async (shareToken) => {
  // Get Conversation
  const { data: conversation, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("share_token", shareToken)
    .single();

  if (error || !conversation) {
    throw new Error("Shared conversation not found");
  }

  // Get Messages
  const { data: messages, error: msgError } = await supabase
    .from("conversation_messages")
    .select("*")
    .eq("conversation_id", conversation.id)
    .order("created_at", {
      ascending: true,
    });

  if (msgError) {
    throw new Error(msgError.message);
  }

  conversation.messages = messages;

  return conversation;
};