import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "customer") {
    return <Navigate to="/customer" replace />;
  }

  if (user.role === "rider") {
    return <Navigate to="/rider" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <div>Unknown user role.</div>;
}
