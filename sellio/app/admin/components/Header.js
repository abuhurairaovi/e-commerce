"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
    { name: "Dashboard", href: "/admin" },
    { name: "Products", href: "/admin/products" },
    { name: "Orders", href: "/admin/orders" },
    { name: "Customers", href: "/admin/customers" },
];

const titles = {
    "/admin": "Dashboard",
    "/admin/products": "Products",
    "/admin/orders": "Orders",
    "/admin/customers": "Customers",
};

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const title = titles[pathname] || "admin";

    function handleLogout() {
        document.cookie = "admin_auth=; path=/; max-age=0";
        router.push("/admin/login");
    }

    return (
        <header className="sticky top-0 z-20 bg-white backdrop-blur border-b border-white/10">
            <div className="h-16 px-4 md:px-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setOpen(!open)}
                        className="md:hidden text-white/70 hover:text-white"
                        aria-label="Toggle menu"
                    >
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M3 6h18M3 12h18M3 18h18" />
                        </svg>
                    </button>

                    <h1 className="text-lg font-semibold text-black">{title}</h1>
                </div>

                <div className="flex items-center gap-4">
                    <span className="hidden sm:block text-sm text-black">
                        {new Date().toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        })}
                    </span>

                    <button
                        onClick={handleLogout}
                        className="text-black hover:text-red-400 text-sm transition-colors"
                    >
                        LOGOUT
                    </button>

                    <div className="w-9 h-9 rounded-full bg-[#22c55e]/20 flex items-center justify-center text-[#22c55e] font-semibold text-sm">
                        A
                    </div>
                </div>
            </div>

            {open && (
                <nav className="md:hidden border-t border-white px-4 py-3 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={`block px-3 py-2 rounded-lg text-sm font-medium ${pathname === item.href
                                    ? "bg-[#22c55e]/15 text-[#22c55e]"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>
            )}
        </header>
    );
}