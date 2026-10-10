import React, { createContext, useEffect, useRef, useState } from "react";
import { tokenService } from "./tokenService";
import { refreshSession, logoutRequest } from "../hooks/useApi";

interface AuthContextType {
    isAuthenticated: boolean;
    isBootstrapping: boolean;
    login: (designerCode: string) => void;
    logout: () => void;
    isAccountSetup: boolean;
    completeAccountSetup: () => void;
    isAccountSetupPromptDismissed: boolean;
    dismissAccountSetupPrompt: () => void;

}
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isBootstrapping, setIsBootstrapping] = useState(true);
    const [isAccountSetup, setIsAccountSetup] = useState(tokenService.getAccountSetup() == "true" ? true : false);
    const [isAccountSetupPromptDismissed, setIsAccountSetupPromptDismissed] = useState(tokenService.getAccountSetupPromptDismissed());
    const authActionVersion = useRef(0);

    // Restore the session from the httpOnly refresh cookie on load.
    useEffect(() => {
        let active = true;
        const actionVersion = authActionVersion.current;
        refreshSession()
            .then((ok) => {
                if (active && actionVersion === authActionVersion.current) {
                    setIsAuthenticated(ok);
                }
            })
            .finally(() => { if (active) setIsBootstrapping(false); });
        return () => { active = false; };
    }, []);

    const login = (designerCode: string, isAccountSetup = false) => {
        authActionVersion.current += 1;
        if (designerCode) tokenService.setDesignerCode(designerCode);
        setIsAuthenticated(true);
        setIsBootstrapping(false);
        tokenService.setAccountSetup(isAccountSetup);
        setIsAccountSetup(isAccountSetup);
        tokenService.clearAccountSetupPromptDismissed();
        setIsAccountSetupPromptDismissed(false);
    };

    const logout = () => {
        authActionVersion.current += 1;
        logoutRequest();
        tokenService.clearDesignerCode();
        setIsAuthenticated(false);
        tokenService.clearAccountSetup();
        setIsAccountSetup(false);
        tokenService.clearAccountSetupPromptDismissed();
        setIsAccountSetupPromptDismissed(false);
    };

    const dismissAccountSetupPrompt = () => {
        tokenService.setAccountSetupPromptDismissed();
        setIsAccountSetupPromptDismissed(true);
    };

    const completeAccountSetup = () => {
        tokenService.setAccountSetup(true);
        setIsAccountSetup(true);
        tokenService.clearAccountSetupPromptDismissed();
        setIsAccountSetupPromptDismissed(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isBootstrapping, login, logout, isAccountSetup, completeAccountSetup, isAccountSetupPromptDismissed, dismissAccountSetupPrompt }}>
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
