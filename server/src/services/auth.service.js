import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import supabase from "../config/supabase.js";
import env from "../config/env.js";

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

export const loginUser = async (email, password) => {
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

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  delete user.password;

  return {
    user,
    token,
  };
};