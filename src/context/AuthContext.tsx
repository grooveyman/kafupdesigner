import React, { createContext } from "react";
import { tokenService } from "./tokenService";


interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string, designerCode: string, isAccountSetup?: boolean) => void;
    logout: () => void;
    setAccessToken?: (token: string) => void;
    getAccessToken?: () => string | null;
    clearAccessToken?: () => void;
    isAccountSetup: boolean;
}
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [authcredentials, setAuthcredentials] = React.useState({
        token: tokenService.get() || "",
        designerCode: tokenService.getDesignerCode() || "",
        isAccountSetup:  tokenService.getAccountSetup() == "true" ? true:false
    });


    const login = (token: string, designerCode: string, isAccountSetup = false) => {
        setAuthcredentials({ token, designerCode, isAccountSetup });
        tokenService.set(token);
        tokenService.setDesignerCode(designerCode);
        tokenService.setAccountSetup(isAccountSetup);
    };

    const logout = () => {
        setAuthcredentials({ token: "", designerCode: "", isAccountSetup: false });
        tokenService.clear();
        tokenService.clearDesignerCode();
    };

    const isAuthenticated = !!authcredentials.token;
    const isAccountSetup = authcredentials.isAccountSetup;
    //restore token on mount
    

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, isAccountSetup}}>
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