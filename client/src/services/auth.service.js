import api from "./api";

export const loginUser = async (email, password) => {
  const { data } = await api.post("/auth/login", {
    email,
    password,
  });

  return data;
};

export const signupUser = async (userData) => {
  const { data } = await api.post("/auth/signup", userData);

  return data;
};

export const getCurrentUser = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};