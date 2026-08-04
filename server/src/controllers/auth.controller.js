import {
  createUser,
  loginUser,
  googleLogin,
} from "../services/auth.service.js";

import supabase from "../config/supabase.js";

// ======================================
// Signup
// ======================================

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

// ======================================
// Email Login
// ======================================

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { user, token } =
      await loginUser(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
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

// ======================================
// Google Login
// ======================================

export const googleAuth = async (
  req,
  res
) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required.",
      });
    }

    const { user, token } =
      await googleLogin(credential);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Google login successful 🚀",
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

// ======================================
// Current User
// ======================================

export const getCurrentUser = async (
  req,
  res
) => {
  try {
    const { data: user, error } =
      await supabase
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