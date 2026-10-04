"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function DashboardIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="9" rx="1.5" />
            <rect x="14" y="3" width="7" height="5" rx="1.5" />
            <rect x="14" y="12" width="7" height="9" rx="1.5" />
            <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </svg>
    );
}

function ProductsIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 7l9-4 9 4-9 4-9-4z" />
            <path d="M3 7v10l9 4 9-4V7" />
            <path d="M12 11v10" />
        </svg>
    );
}

function OrdersIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2l1.5 4h9L18 2" />
            <rect x="4" y="6" width="16" height="16" rx="2" />
            <path d="M9 11h6M9 15h6" />
        </svg>
    );
}

function CustomersIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="8" r="3.5" />
            <path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
            <circle cx="17.5" cy="8.5" r="2.75" />
            <path d="M16 13.6c2.9.5 5 2.9 5 5.9" />
        </svg>
    );
}

// হোম পেজে যাওয়ার জন্য নতুন আইকন
function GlobeIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    );
}

const navItems = [
    { name: "Dashboard", href: "/admin", icon: DashboardIcon },
    { name: "Products", href: "/admin/products", icon: ProductsIcon },
    { name: "Orders", href: "/admin/orders", icon: OrdersIcon },
    { name: "Customers", href: "/admin/customers", icon: CustomersIcon },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-white border-black/15 min-h-screen sticky top-0 border-r">
            <div className="h-20 flex items-center px-6 border-b border-black/10">
                {/* লোগোতে ক্লিক করলে সরাসরি হোম পেজে চলে যাবে */}
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="text-2xl font-bold tracking-tight text-black group-hover:text-[#16a34a] transition-colors">
                        SELL<span className="text-[#16a34a]">IO</span>
                    </span>
                </Link>
                <span className="ml-2 text-[10px] uppercase tracking-widest text-black/40 border border-black/10 rounded px-1.5 py-0.5">
                    admin
                </span>
            </div>

            <nav className="flex-1 px-3 py-6 space-y-1">
                {navItems.map((item) => {
                    const isActive =
                        item.href === "/admin"
                            ? pathname === "/admin"
                            : pathname?.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? "bg-[#22c55e]/15 text-[#16a34a]"
                                    : "text-black/60 hover:text-black hover:bg-black/5"
                                }`}
                        >
                            <Icon active={isActive} />
                            {item.name}
                        </Link>
                    );
                })}

                {/* ড্যাশবোর্ড থেকে এক ক্লিকে মূল ওয়েবসাইটে যাওয়ার এক্সট্রা বাটন */}
                <div className="pt-4 mt-4 border-t border-black/10">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-black/60 hover:text-black hover:bg-black/5 transition-colors"
                    >
                        <GlobeIcon />
                        Visit Website
                    </Link>
                </div>
            </nav>

            <div className="p-4 border-t border-black/10">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-9 h-9 rounded-full bg-[#22c55e]/20 flex items-center justify-center text-[#16a34a] font-semibold text-sm">
                        A
                    </div>
                    <div className="leading-tight">
                        <p className="text-sm text-black font-medium">Admin</p>
                        <p className="text-xs text-black/40">Store owner</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}