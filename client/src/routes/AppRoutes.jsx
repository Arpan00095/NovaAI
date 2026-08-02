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

import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>

          {/* Public */}
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          {/* Protected */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Workspace />
              </ProtectedRoute>
            }
          />

          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            }
          />

          {/* Redirect old /ai */}
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