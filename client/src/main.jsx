import React from "react";
import ReactDOM from "react-dom/client";

import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App.jsx";

import "./index.css";

/* Highlight.js Theme */
import "highlight.js/styles/github-dark.css";

import { ThemeProvider } from "./contexts/ThemeProvider.jsx";
import AuthProvider from "./contexts/AuthProvider.jsx";
import ConversationProvider from "./contexts/ConversationProvider.jsx";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
    >
      <ThemeProvider>
        <AuthProvider>
          <ConversationProvider>
            <App />
          </ConversationProvider>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);