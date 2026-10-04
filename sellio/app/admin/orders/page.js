"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

const statusColor = {
    Pending: "bg-yellow-500/15 text-yellow-600",
    Shipped: "bg-blue-500/15 text-blue-600",
    Delivered: "bg-[#22c55e]/15 text-[#16a34a]",
    Cancelled: "bg-red-500/15 text-red-500",
};

const statusOption = ["All", "Pending", "Shipped", "Delivered", "Cancelled"];

export default function OrderPages() {
    const { token, loading: authLoading } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        if (authLoading) return;

        if (!token) {
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            try {
                const res = await fetch("/api/admin/orders", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.status === 401 || res.status === 403) {
                    throw new Error("আপনার এই পেজ দেখার অনুমতি নেই।");
                }

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Failed to load orders.");
                }

                setOrders(data.orders || []);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token, authLoading]);

    const filtered =
        filter === "All" ? orders : orders.filter((o) => o.status === filter);

    async function updateStatus(id, status) {
        const previous = orders;

        // আগে UI তে সাথে সাথে বদলে দিচ্ছি (optimistic update)
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));

        try {
            const res = await fetch(`/api/admin/orders/${id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });

            if (!res.ok) throw new Error("Status update failed");
        } catch (err) {
            console.error(err);
            setOrders(previous); // ব্যর্থ হলে আগের অবস্থায় ফিরে যাবে
            alert("Status update ব্যর্থ হয়েছে, আবার চেষ্টা করুন।");
        }
    }

    if (authLoading || loading) {
        return <p className="text-black">Loading orders...</p>;
    }

    if (!token) {
        return <p className="text-red-500">অনুগ্রহ করে অ্যাডমিন হিসেবে লগইন করুন।</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
                {statusOption.map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === status
                                ? "bg-[#22c55e] text-black"
                                : "bg-white border border-black/20 text-black hover:text-green-600"
                            }`}
                    >
                        {status === "All" ? "সবগুলো" : status}
                    </button>
                ))}
            </div>

            <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-black/40 border-b border-black/10">
                                <th className="px-5 py-3 font-medium">Order ID</th>
                                <th className="px-5 py-3 font-medium">Customer</th>
                                <th className="px-5 py-3 font-medium">Date</th>
                                <th className="px-5 py-3 font-medium">Total</th>
                                <th className="px-5 py-3 font-medium">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.map((order) => (
                                <tr
                                    key={order.id}
                                    className="border-b border-black/5 last:border-0 hover:bg-black/[0.02]"
                                >
                                    <td className="px-5 py-3 text-black font-medium">
                                        #{order.id}
                                    </td>
                                    <td className="px-5 py-3 text-black">
                                        {order.customer || "N/A"}
                                    </td>
                                    <td className="px-5 py-3 text-black">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-5 py-3 text-black">
                                        ৳{Number(order.total_price).toLocaleString("en-BD")}
                                    </td>
                                    <td className="px-5 py-3">
                                        <select
                                            value={order.status}
                                            onChange={(e) =>
                                                updateStatus(order.id, e.target.value)
                                            }
                                            className={`text-xs px-2.5 py-1.5 rounded-full border-0 focus:outline-none focus:ring-1 focus:ring-[#22c55e] cursor-pointer ${statusColor[order.status] || ""
                                                }`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}

                            {filtered.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-5 py-10 text-center text-black/50"
                                    >
                                        এই স্ট্যাটাসে কোনো অর্ডার নেই
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