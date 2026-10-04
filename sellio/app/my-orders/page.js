"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

const statusColor = {
    Pending: "bg-yellow-500/15 text-yellow-600",
    Shipped: "bg-blue-500/15 text-blue-600",
    Delivered: "bg-[#22c55e]/15 text-[#16a34a]",
    Cancelled: "bg-red-500/15 text-red-500",
};

export default function MyOrdersPage() {
    const { token, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (authLoading) return; // সেশন লোড হওয়া পর্যন্ত অপেক্ষা

        if (!token) {
            setLoading(false);
            return;
        }

        (async () => {
            try {
                const res = await fetch("/api/my-orders", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("অর্ডার লোড করা যায়নি।");
                const data = await res.json();
                setOrders(data.orders || []);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [token, authLoading]);

    if (authLoading || loading) return <p className="p-6">Loading...</p>;

    if (!token) {
        return (
            <div className="max-w-3xl mx-auto p-6">
                <p className="mb-3">অর্ডার দেখতে লগইন করুন।</p>
                <Link href="/login" className="underline font-medium">Login</Link>
            </div>
        );
    }

    if (error) return <p className="p-6 text-red-500">{error}</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold">My Orders</h1>

            {orders.length === 0 && (
                <p className="text-black/50">আপনার কোনো অর্ডার নেই।</p>
            )}

            {orders.map((order) => (
                <div key={order.id} className="border border-black/10 rounded-xl p-4 bg-white">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="font-semibold">Order #{order.id}</p>
                            <p className="text-xs text-black/50">
                                {new Date(order.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <span
                            className={`text-xs px-2.5 py-1 rounded-full ${statusColor[order.status] || ""}`}
                        >
                            {order.status}
                        </span>
                    </div>

                    <ul className="text-sm space-y-1 mb-3">
                        {order.items.map((it) => (
                            <li key={it.id} className="flex justify-between">
                                <span>
                                    {it.name} × {it.quantity}
                                </span>
                                <span>
                                    ৳{(Number(it.price) * it.quantity).toLocaleString("en-BD")}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <p className="text-right font-semibold border-t border-black/10 pt-2">
                        Total: ৳{Number(order.total_price).toLocaleString("en-BD")}
                    </p>
                </div>
            ))}
        </div>
    );
}