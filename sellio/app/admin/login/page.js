"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/utils/supabase"; // নিশ্চিত করো utils/supabase সঠিক পাথ অনুযায়ী আছে

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (authError) {
            setError(authError.message);
            return;
        }

        // সফলভাবে লগইন হলে এডমিন ড্যাশবোর্ড বা হোম পেজে রিডাইরেক্ট করবে
        router.push("/");
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#f9fafb" }}>
            <div style={{ width: "100%", maxWidth: "400px", padding: "32px", background: "#fff", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                <h2 style={{ textAlign: "center", marginBottom: "24px", fontSize: "24px", fontWeight: "bold" }}>আপনার একাউন্টে প্রবেশ করুন</h2>
                
                {error && (
                    <div style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "12px", borderRadius: "6px", marginBottom: "16px", fontSize: "14px", textAlign: "center" }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                        <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@gmail.com"
                            required
                            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", outline: "none" }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", outline: "none" }}
                        />
                    </div>

                    <div style={{ textAlign: "right" }}>
                        <Link href="/forgot-password" style={{ fontSize: "13px", color: "#2563eb", textDecoration: "none" }}>
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ width: "100%", padding: "12px", backgroundColor: "#000", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#6b7280" }}>
                    Account নেই? <Link href="/signup" style={{ color: "#2563eb", fontWeight: "500" }}>Sign up</Link>
                </p>
            </div>
        </div>
    );
}