import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  });

  // -----------------------------
  // Login
  // -----------------------------

  const login = (userData, jwtToken) => {
    localStorage.setItem("token", jwtToken);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setToken(jwtToken);
    setUser(userData);
  };

  // -----------------------------
  // Logout
  // -----------------------------

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);

    toast.success("Logged out successfully 👋");
  };

  // -----------------------------
  // Guest Mode
  // -----------------------------

  const isAuthenticated = !!token;

  const isGuest = !isAuthenticated;

  const value = useMemo(
    () => ({
      user,
      token,

      loading: false,

      login,
      logout,

      isAuthenticated,
      isGuest,
    }),
    [
      user,
      token,
      isAuthenticated,
      isGuest,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;