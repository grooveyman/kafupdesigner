import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { tokenService } from "../context/tokenService";

export default function ProtectedRoute() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [checking, setChecking] = React.useState(true);

    useEffect(() => {
        const token = tokenService.get();
        if(!token){
            navigate("/login");
        }
        setChecking(false);
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, []);

    if(checking) return null;

    if (!isAuthenticated){
        navigate("/login");
        return null;
    }

    return <Outlet />;
}