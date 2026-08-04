import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===================================
// Request Interceptor
// ===================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===================================
// Response Interceptor
// ===================================

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("Unauthorized request (Guest Mode or Expired Token)");

      // Token expire hua ho to remove kar do
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // ❌ Redirect mat karo
      // ChatGPT / Gemini ki tarah guest mode allow karo
    }

    return Promise.reject(error);
  }
);

export default api;