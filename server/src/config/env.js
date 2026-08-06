import dotenv from "dotenv";

dotenv.config();

const env = {
  PORT: process.env.PORT || 5000,

  CLIENT_URL:
    process.env.CLIENT_URL || "http://localhost:5173",

  JWT_SECRET:
    process.env.JWT_SECRET || "change_this_in_production",

  // Gemini API Keys Pool (Key Rotation ke liye)
  GEMINI_API_KEY_1:
    process.env.GEMINI_API_KEY_1 || process.env.GEMINI_API_KEY || "",

  GEMINI_API_KEY_2:
    process.env.GEMINI_API_KEY_2 || "",

  GEMINI_API_KEY_3:
    process.env.GEMINI_API_KEY_3 || "",

  GEMINI_API_KEY_4:
    process.env.GEMINI_API_KEY_4 || "",

  SUPABASE_URL:
    process.env.SUPABASE_URL || "",

  SUPABASE_SERVICE_ROLE_KEY:
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",

  GOOGLE_CLIENT_ID:
    process.env.GOOGLE_CLIENT_ID || "",
};

export default env;