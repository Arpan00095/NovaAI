import supabase from "../config/supabase.js";

export const healthCheck = async (req, res) => {
  try {
    const { error } = await supabase
      .from("users")
      .select("*")
      .limit(1);

    res.status(200).json({
      success: true,
      message: "NovaAI API is running 🚀",
      database: error ? "Connected (users table not created yet)" : "Connected",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Supabase connection failed",
      error: err.message,
    });
  }
};