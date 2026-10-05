"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!email) {
            setError("দয়া করে আপনার ইমেইল দিন");
            return;
        }

        setLoading(true);

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            });

            if (resetError) {
                setError(resetError.message);
                setLoading(false);
                return;
            }

            setMessage("পাসওয়ার্ড রিসেট করার লিঙ্ক আপনার ইমেইলে পাঠানো হয়েছে।");
        } catch (err) {
            console.error(err);
            setError("রিসেট লিঙ্ক পাঠানোর সময় সমস্যা হয়েছে");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8">
                <h1 className="text-2xl font-semibold text-center mb-2">Forgot Password</h1>
                <p className="text-sm text-gray-500 text-center mb-6">
                    আপনার অ্যাকাউন্টের পাসওয়ার্ড পুনরুদ্ধার করুন
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-md mb-4 text-center">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="bg-green-50 text-green-600 text-sm px-4 py-2 rounded-md mb-4 text-center">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-60"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <p className="text-sm text-center text-gray-500 mt-6">
                    মনে আছে?{" "}
                    <Link href="/admin/login" className="text-black font-medium hover:underline">
                        Login করুন
                    </Link>
                </p>
            </div>
        </div>
    );
}