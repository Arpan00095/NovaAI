import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const {
    loading,
    isAuthenticated,
    user,
    token,
  } = useContext(AuthContext);

  console.log("ProtectedRoute:", {
    loading,
    isAuthenticated,
    user,
    token,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;