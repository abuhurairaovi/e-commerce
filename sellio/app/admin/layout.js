"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { supabase } from "@/utils/supabase";

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const isLoginPage = pathname === "/admin/login";
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        if (isLoginPage) {
            setAllowed(true);
            return;
        }

        const checkAdminSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                // সেশন না থাকলে লগইন পেজে পাঠাবে
                router.replace("/login");
                return;
            }

            setAllowed(true);
        };

        checkAdminSession();
    }, [isLoginPage, router]);

    if (isLoginPage) {
        return <div className="bg-white min-h-screen">{children}</div>;
    }

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