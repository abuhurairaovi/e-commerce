"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // পেজ খুললে বর্তমান সেশন নেওয়া
        supabase.auth.getSession().then(({ data }) => {
            setUser(data.session?.user ?? null);
            setToken(data.session?.access_token ?? null);
            setLoading(false);
        });

        // লগইন, লগআউট, টোকেন রিফ্রেশ হলে নিজে থেকে আপডেট হবে
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setToken(session?.access_token ?? null);
            setLoading(false);
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    // আগের কোডের সাথে মিল রাখার জন্য, Supabase নিজেই সেশন সামলায়
    const login = () => { };

    const logout = async () => {
        await supabase.auth.signOut();
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