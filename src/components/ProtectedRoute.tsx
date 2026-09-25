import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { tokenService } from "../context/tokenService";

export default function ProtectedRoute() {
    const { isAuthenticated } = useAuth();
    const hasToken = Boolean(tokenService.get());

    if (!isAuthenticated && !hasToken) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}