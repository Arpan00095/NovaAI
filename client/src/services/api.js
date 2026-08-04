import axios from "axios";

const api = axios.create({
  baseURL: "https://novaai-api.onrender.com/api",
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
      console.warn(
        "Unauthorized request (Guest Mode or Expired Token)"
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Guest mode allowed
    }

    return Promise.reject(error);
  }
);

export default api;