"use client";

import { useEffect, useState } from "react";
import StatCard from "./components/StatCard";
import { useAuth } from "@/app/context/AuthContext";

export default function AdminDashboard() {
    const { token, loading: authLoading } = useAuth();

    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (authLoading) return; // সেশন লোড হওয়া পর্যন্ত অপেক্ষা

        if (!token) {
            setLoading(false);
            return;
        }

        const fetchAll = async () => {
            try {
                const res = await fetch("/api/admin/dashboard", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.status === 401 || res.status === 403) {
                    throw new Error("আপনার এই পেজ দেখার অনুমতি নেই।");
                }
                if (!res.ok) throw new Error("Dashboard data আনতে সমস্যা হয়েছে।");

                const data = await res.json();
                setProducts(data.products || []);
                setOrders(data.orders || []);
                setCustomers(data.customers || []);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [token, authLoading]);

    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_price || 0), 0);
    const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 3).length;
    const outOfStockCount = products.filter((p) => p.stock === 0).length;

    const statusColor = {
        Pending: "bg-yellow-500/15 text-yellow-600",
        Shipped: "bg-blue-500/15 text-blue-600",
        Delivered: "bg-[#22c55e]/15 text-[#16a34a]",
        Cancelled: "bg-red-500/15 text-red-500",
    };

    const recentOrders = [...orders]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

    if (authLoading || loading) return <p className="text-black">Loading dashboard...</p>;
    if (!token) return <p className="text-red-500">অনুগ্রহ করে অ্যাডমিন হিসেবে লগইন করুন।</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total product" value={products.length} change={4} icon={BoxIcon} />
                <StatCard label="Total customers" value={customers.length} change={8} icon={UserIcon} />
                <StatCard label="Total order" value={orders.length} change={12} icon={CartIcon} />
                <StatCard
                    label="Total sell"
                    value={`৳${totalRevenue.toLocaleString("en-BD")}`}
                    change={12}
                    icon={TakaIcon}
                />
            </div>

            {(lowStockCount > 0 || outOfStockCount > 0) && (
                <div className="bg-white border border-yellow-500/30 rounded-xl p-4 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-yellow-500 shrink-0" />
                    <p className="text-sm text-black/70">
                        <span className="text-yellow-600 font-medium">{lowStockCount} pcs</span> product stock is low,{" "}
                        <span className="text-red-500 font-medium">{outOfStockCount} pcs</span> stock out —{" "}
                        <a href="/admin/products" className="text-[#16a34a] hover:underline">see</a>
                    </p>
                </div>
            )}

            <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-black/10 flex items-center justify-between">
                    <h2 className="font-semibold text-black">Recent orders</h2>
                    <a href="/admin/orders" className="text-sm text-[#16a34a] hover:underline">see</a>
                </div>

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
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="border-b border-black/5 last:border-0">
                                    <td className="px-5 py-3 font-medium text-black">#{order.id}</td>
                                    <td className="px-5 py-3 text-black/70">
                                        {order.customer || order.customer_name || `User #${order.user_id}`}
                                    </td>
                                    <td className="px-5 py-3 text-black/70">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-5 py-3 text-black/70">
                                        ৳{Number(order.total_price).toLocaleString("en-BD")}
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs px-2.5 py-1 rounded-full ${statusColor[order.status] || ""}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}

                            {recentOrders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-8 text-center text-black/50">
                                        কোনো order নেই
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

function BoxIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 7l9-4 9 4-9 4-9-4z" />
            <path d="M3 7v10l9 4 9-4V7" />
        </svg>
    );
}
function CartIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="20" r="1" />
            <circle cx="18" cy="20" r="1" />
            <path d="M2 3h2l2.6 12.6a2 2 0 002 1.4h8.8a2 2 0 002-1.6L21 8H6" />
        </svg>
    );
}
function UserIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        </svg>
    );
}
function TakaIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20M7 8h7a3 3 0 010 6H8l8 8" />
        </svg>
    );
}