import React, { createContext, useEffect } from "react";
import { tokenService } from "./tokenService";


interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string, designerCode: string) => void;
    logout: () => void;
    setAccessToken?: (token: string) => void;
    getAccessToken?: () => string | null;
    clearAccessToken?: () => void;
}
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [authcredentials, setAuthcredentials] = React.useState({
        token: tokenService.get() || "",
        designerCode: tokenService.getDesignerCode() || "",
    });


    const login = (token: string, designerCode: string) => {
        setAuthcredentials({ token, designerCode });
        tokenService.set(token);
        tokenService.setDesignerCode(designerCode);
    };

    const logout = () => {
        setAuthcredentials({ token: "", designerCode: "" });
        tokenService.clear();
        tokenService.clearDesignerCode();
    };

    const isAuthenticated = !!authcredentials.token;

    //restore token on mount
    

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout}}>
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