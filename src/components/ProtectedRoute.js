import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useAdmin } from "../hooks/useAdmin";

const ProtectedRoute = ({ children }) => {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: admin, isLoading: adminLoading } = useAdmin();

  const isLoading = userLoading || adminLoading;

  if (isLoading) return <div>Loading...</div>;

  // allow if either admin OR user exists
  if (!user && !admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;