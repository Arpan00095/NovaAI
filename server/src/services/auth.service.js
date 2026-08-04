import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import supabase from "../config/supabase.js";
import env from "../config/env.js";

const googleClient = new OAuth2Client(
  env.GOOGLE_CLIENT_ID
);

// ======================================
// Generate JWT
// ======================================

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// ======================================
// Signup
// ======================================

export const createUser = async (userData) => {
  const { full_name, email, password } = userData;

  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        full_name,
        email,
        password: hashedPassword,
        auth_provider: "email",
        is_verified: false,
      },
    ])
    .select(
      "id, full_name, email, avatar_url, auth_provider, is_verified, created_at"
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// ======================================
// Email Login
// ======================================

export const loginUser = async (
  email,
  password
) => {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.password) {
    throw new Error(
      "This account uses Google Sign-In."
    );
  }

  const valid = await bcrypt.compare(
    password,
    user.password
  );

  if (!valid) {
    throw new Error(
      "Invalid email or password"
    );
  }

  delete user.password;

  return {
    user,
    token: generateToken(user),
  };
};

// ======================================
// Google Login / Signup
// ======================================

export const googleLogin = async (
  credential
) => {
  const ticket =
    await googleClient.verifyIdToken({
      idToken: credential,
      audience: env.GOOGLE_CLIENT_ID,
    });

  const payload = ticket.getPayload();

  const email = payload.email;
  const full_name = payload.name;
  const avatar_url = payload.picture;

  let { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  // -------------------------
  // New User
  // -------------------------

  if (!user) {
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          full_name,
          email,
          avatar_url,
          password: null,
          auth_provider: "google",
          is_verified: true,
        },
      ])
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    user = data;
  }

  // -------------------------
  // Existing User
  // -------------------------

  else {
    await supabase
      .from("users")
      .update({
        avatar_url,
        full_name,
        auth_provider: "google",
        is_verified: true,
      })
      .eq("id", user.id);

    user.avatar_url = avatar_url;
    user.full_name = full_name;
    user.auth_provider = "google";
    user.is_verified = true;
  }

  delete user.password;

  return {
    user,
    token: generateToken(user),
  };
};