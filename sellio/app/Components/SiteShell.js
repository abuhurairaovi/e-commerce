"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";

export default function SiteShell({ children }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith("/admin");

    // admin পেজে সাইটের Navbar ও Footer দেখাবে না
    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
}