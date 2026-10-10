import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
    const { isAuthenticated, isBootstrapping, isAccountSetup, isAccountSetupPromptDismissed } = useAuth();
    const location = useLocation();

    if (isBootstrapping) return null;
    if(!isAuthenticated) return <Navigate to="/login" replace />;

    if (!isAccountSetup && !isAccountSetupPromptDismissed && location.pathname !== "/accountsetup") {
        return <Navigate to="/accountsetup" replace />;
    }

    return <Outlet />;
}
