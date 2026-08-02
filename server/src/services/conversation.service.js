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

    console.log("Supabase Data:", data);
    console.log("Supabase Error:", error);

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
// Save Message
export const saveMessage = async (
  conversationId,
  role,
  content
) => {
  const { data, error } = await supabase
    .from("conversation_messages")
    .insert({
      conversation_id: conversationId,
      role,
      content,
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

