import supabase from "../config/supabase.js";

// Save or Update Memory
export const saveMemory = async (
  userId,
  key,
  value
) => {
  const { error } = await supabase
    .from("ai_memory")
    .upsert(
      {
        user_id: userId,
        memory_key: key,
        memory_value: value,
      },
      {
        onConflict: "user_id,memory_key",
      }
    );

  if (error) throw error;
};

// Get Memories
export const getMemories = async (
  userId
) => {
  const { data, error } = await supabase
    .from("ai_memory")
    .select("memory_key,memory_value")
    .eq("user_id", userId);

  if (error) throw error;

  return data || [];
};

// Delete Memory
export const deleteMemory = async (
  userId,
  key
) => {
  const { error } = await supabase
    .from("ai_memory")
    .delete()
    .eq("user_id", userId)
    .eq("memory_key", key);

  if (error) throw error;
};