import api from "./api";

// =====================================
// Email Login
// =====================================

export const loginUser = async (
  email,
  password
) => {
  const { data } = await api.post(
    "/auth/login",
    {
      email,
      password,
    }
  );

  return data;
};


// =====================================
// Email Signup
// =====================================

export const signupUser = async (
  userData
) => {
  const { data } = await api.post(
    "/auth/signup",
    userData
  );

  return data;
};


// =====================================
// Google Login / Signup
// =====================================

export const googleLogin = async (
  credential
) => {
  const { data } = await api.post(
    "/auth/google",
    {
      credential,
    }
  );

  return data;
};


// =====================================
// Current User
// =====================================

export const getCurrentUser =
  async () => {
    const { data } = await api.get(
      "/auth/me"
    );

    return data;
  };