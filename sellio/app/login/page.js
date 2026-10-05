"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/utils/supabase";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.email || !formData.password) {
            setError("Email এবং Password দিতে হবে");
            return;
        }

        setLoading(true);

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (authError) {
                setError(authError.message);
                setLoading(false);
                return;
            }

            // সফলভাবে লগইন হওয়ার পর সরাসরি অ্যাডমিন প্যানেলে রিডাইরেক্ট করবে
            router.push("/admin");
        } catch (err) {
            console.error(err);
            setError("লগইন করার সময় সমস্যা হয়েছে");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8">
                <h1 className="text-2xl font-semibold text-center mb-2">Login</h1>
                <p className="text-sm text-gray-500 text-center mb-6">
                    আপনার account এ প্রবেশ করুন
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-md mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="********"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                    </div>

                    <div className="flex justify-end">
                        <Link
                            href="/forgot-password"
                            className="text-sm text-gray-500 hover:text-black"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-sm text-center text-gray-500 mt-6">
                    Account নেই?{" "}
                    <Link href="/signup" className="text-black font-medium hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}