import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";

import "./index.css";

import { ThemeProvider } from "./contexts/ThemeProvider.jsx";
import AuthProvider from "./contexts/AuthProvider.jsx";
import ConversationProvider from "./contexts/ConversationProvider.jsx";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ConversationProvider>
          <App />
        </ConversationProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);