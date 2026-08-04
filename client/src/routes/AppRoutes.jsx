import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Workspace from "../pages/Workspace";
import Library from "../pages/Library";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import Appearance from "../pages/Appearance";
import About from "../pages/About";
import Archived from "../pages/Archived";
import SharedConversation from "../pages/SharedConversation";

import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<MainLayout />}>

          {/* ==========================
              Public Routes
          ========================== */}

          <Route
            path="/"
            element={<Workspace />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          {/* Public Shared Conversation */}

          <Route
            path="/share/:token"
            element={<SharedConversation />}
          />

          {/* ==========================
              Protected Routes
          ========================== */}

          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/appearance"
            element={
              <ProtectedRoute>
                <Appearance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />

          {/* Archived Chats */}

          <Route
            path="/archived"
            element={
              <ProtectedRoute>
                <Archived />
              </ProtectedRoute>
            }
          />

          {/* Redirect old AI route */}

          <Route
            path="/ai"
            element={<Navigate to="/" replace />}
          />

          {/* 404 */}

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;