"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (email && password) {
            router.push("/admin");
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-gray-700 border border-white/10 rounded-xl p-6">
                <h1 className="text-2xl font-bold text-white text-center">
                    Login
                </h1>

                <p className="text-sm text-white/50 text-center mt-2">
                    account login
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="text-sm text-white/70">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder=" email "
                            className="w-full mt-2 bg-[#080c14] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#22c55e]/50"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-white/70">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder=" password "
                            className="w-full mt-2 bg-[#080c14] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#22c55e]/50"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#22c55e] text-black font-semibold rounded-lg py-2.5 hover:bg-[#16a34a] transition"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}