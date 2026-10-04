"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const isLoginPage = pathname === "/admin/login";
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        if (isLoginPage) return;

        const checkAdmin = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                router.replace("/admin/login");
                return;
            }
            try {
                // ব্যাকএন্ড যাচাই করবে token টা admin এর কিনা
                const res = await fetch(`${API_URL}/api/customers`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    setAllowed(true);
                } else {
                    router.replace("/admin/login");
                }
            } catch {
                router.replace("/admin/login");
            }
        };

        checkAdmin();
    }, [isLoginPage, pathname, router]);

    if (isLoginPage) {
        return <div className="bg-white min-h-screen">{children}</div>;
    }

    // যাচাই শেষ না হওয়া পর্যন্ত কিছুই দেখাবে না
    if (!allowed) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center text-black/40">
                Checking access...
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-white">
            <Sidebar />
            <div className="flex-1 min-w-0">
                <Header />
                <main className="p-4 md:p-8">{children}</main>
            </div>
        </div>
    );
}