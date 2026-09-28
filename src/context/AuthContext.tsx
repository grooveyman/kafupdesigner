import React, { createContext, useEffect, useState } from "react";
import { tokenService } from "./tokenService";
import { refreshSession, logoutRequest } from "../hooks/useApi";

interface AuthContextType {
    isAuthenticated: boolean;
    isBootstrapping: boolean;
    login: (designerCode: string) => void;
    logout: () => void;
}
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isBootstrapping, setIsBootstrapping] = useState(true);

    // Restore the session from the httpOnly refresh cookie on load.
    useEffect(() => {
        let active = true;
        refreshSession()
            .then((ok) => { if (active) setIsAuthenticated(ok); })
            .finally(() => { if (active) setIsBootstrapping(false); });
        return () => { active = false; };
    }, []);

    const login = (designerCode: string) => {
        if (designerCode) tokenService.setDesignerCode(designerCode);
        setIsAuthenticated(true);
    };

    const logout = () => {
        logoutRequest();
        tokenService.clearDesignerCode();
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isBootstrapping, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
