import dotenv from "dotenv";

dotenv.config();

const env = {
  PORT: process.env.PORT || 5000,

  CLIENT_URL:
    process.env.CLIENT_URL || "http://localhost:5173",

  JWT_SECRET:
    process.env.JWT_SECRET || "change_this_in_production",

  GEMINI_API_KEY:
    process.env.GEMINI_API_KEY || "",

  SUPABASE_URL:
    process.env.SUPABASE_URL || "",

  SUPABASE_SERVICE_ROLE_KEY:
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",

  GOOGLE_CLIENT_ID:
    process.env.GOOGLE_CLIENT_ID || "",
};

export default env;