import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
    const { isAuthenticated, isBootstrapping } = useAuth();

    if (isBootstrapping) return null;

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
