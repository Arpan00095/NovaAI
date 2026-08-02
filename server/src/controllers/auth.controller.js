import {
  createUser,
  loginUser,
} from "../services/auth.service.js";
import supabase from "../config/supabase.js";

export const signup = async (req, res) => {
  try {
    const user = await createUser(req.body);

    res.status(201).json({
      success: true,
      message: "User created successfully 🚀",
      user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    const { user, token } = await loginUser(
      email,
      password
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // production me true
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful 🚀",
      token,
      user,
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};
export const getCurrentUser = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select(
        "id, full_name, email, avatar_url, auth_provider, is_verified, created_at"
      )
      .eq("id", req.user.id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};