import { data, Navigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

const ProtectedRoute = ({ children }) => {
  const { data: user, isLoading, isError } = useUser();

  if (isLoading) return <div>Loading...</div>;

  if (isError || !user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
