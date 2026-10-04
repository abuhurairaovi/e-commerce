"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CustomersPage() {
    const [search, setSearch] = useState("");
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const res = await fetch(`${API_URL}/api/customers`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error(`Customers লোড করা যায়নি (${res.status})`);
                const data = await res.json();
                setCustomers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    const filtered = customers.filter(
        (c) =>
            (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
            (c.email || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="relative w-full sm:w-72">
                <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.3-4.3" />
                </svg>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="কাস্টমার খুঁজো..."
                    className="w-full bg-white border border-black/10 rounded-lg pl-9 pr-3 py-2.5 text-sm text-black placeholder-black/30 focus:outline-none focus:border-[#22c55e]/50"
                />
            </div>

            <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-black/40 border-b border-black/10">
                                <th className="px-5 py-3 font-medium">Name</th>
                                <th className="px-5 py-3 font-medium">Email</th>
                                <th className="px-5 py-3 font-medium">Order</th>
                                <th className="px-5 py-3 font-medium">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={4} className="px-5 py-10 text-center text-black/40">
                                        Loading...
                                    </td>
                                </tr>
                            )}
                            {error && !loading && (
                                <tr>
                                    <td colSpan={4} className="px-5 py-10 text-center text-red-500">
                                        {error}
                                    </td>
                                </tr>
                            )}
                            {!loading &&
                                !error &&
                                filtered.map((customer) => (
                                    <tr
                                        key={customer.id}
                                        className="border-b border-black/5 last:border-0 hover:bg-black/[0.02]"
                                    >
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#22c55e]/15 flex items-center justify-center text-[#16a34a] text-xs font-semibold">
                                                    {(customer.name || "?").charAt(0)}
                                                </div>
                                                <span className="text-black font-medium">{customer.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-black/60">{customer.email}</td>
                                        <td className="px-5 py-3 text-black/70">
                                            {customer.orders ?? 0} {customer.orders === 1 ? "order" : "orders"}
                                        </td>
                                        <td className="px-5 py-3 text-black/50">
                                            {customer.created_at
                                                ? new Date(customer.created_at).toLocaleDateString("en-GB")
                                                : "-"}
                                        </td>
                                    </tr>
                                ))}
                            {!loading && !error && filtered.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-5 py-10 text-center text-black/40">
                                        No customers available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}