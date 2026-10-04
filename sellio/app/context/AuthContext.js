"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem("authUser");
        const savedToken = localStorage.getItem("authToken");
        if (savedUser) setUser(JSON.parse(savedUser));
        if (savedToken) setToken(savedToken);
        setLoading(false);
    }, []);

    const login = (userData, authToken) => {
        localStorage.setItem("authUser", JSON.stringify(userData));
        localStorage.setItem("authToken", authToken);
        setUser(userData);
        setToken(authToken);
    };

    const logout = () => {
        localStorage.removeItem("authUser");
        localStorage.removeItem("authToken");
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);