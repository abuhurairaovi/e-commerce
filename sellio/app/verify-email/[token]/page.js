"use client";

import { useEffect, useState, useRef, use } from "react";
import Link from "next/link";

export default function VerifyEmailPage({ params }) {
    const { token } = use(params);
    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");
    const hasVerified = useRef(false);

    useEffect(() => {
        if (hasVerified.current) return;
        hasVerified.current = true;

        async function verify() {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email/${token}`
                );

                const data = await res.json();

                if (!res.ok) {
                    setStatus("error");
                    setMessage(data.message || "Verification failed");
                    return;
                }

                setStatus("success");
                setMessage(data.message || "Email verified successfully");
            } catch (err) {
                console.error(err);
                setStatus("error");
                setMessage("Server এর সাথে যোগাযোগ করা যাচ্ছে না");
            }
        }

        verify();
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8 text-center">
                {status === "loading" && (
                    <p className="text-gray-600">Verify করা হচ্ছে...</p>
                )}

                {status === "success" && (
                    <>
                        <h1 className="text-2xl font-semibold text-green-600 mb-3">
                            ✅ Verified!
                        </h1>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <Link
                            href="/login"
                            className="inline-block bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800"
                        >
                            Login করুন
                        </Link>
                    </>
                )}

                {status === "error" && (
                    <>
                        <h1 className="text-2xl font-semibold text-red-600 mb-3">
                            ❌ ব্যর্থ হয়েছে
                        </h1>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <Link
                            href="/signup"
                            className="text-black font-medium hover:underline"
                        >
                            আবার Signup করুন
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}