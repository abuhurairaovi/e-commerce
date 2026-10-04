"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/app/context/AuthContext";

export default function OrdersPage() {
    const { token, loading: authLoading } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (authLoading) return;

        if (!token) {
            setError("Please login to view your orders.");
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/orders/my-orders`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();

                if (!res.ok) {
                    setError(data.message || "Failed to load orders.");
                    setLoading(false);
                    return;
                }

                setOrders(data);
            } catch (error) {
                console.error(error);
                setError("Server এর সাথে যোগাযোগ করা যাচ্ছে না।");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold mb-2">
                        My Orders
                    </h1>

                    <p className="text-red-500">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="max-w-5xl mx-auto">

                <h1 className="text-3xl font-bold mb-2">
                    My Orders
                </h1>

                <p className="text-gray-500 mb-8">
                    আপনার আগের সব order এখানে দেখতে পারবেন।
                </p>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                        <h2 className="text-xl font-semibold mb-2">
                            No Orders Yet
                        </h2>

                        <p className="text-gray-500">
                            আপনি এখনো কোনো order করেননি।
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">

                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                    <div>
                                        <h2 className="text-lg font-semibold">
                                            Order #{order.id}
                                        </h2>

                                        <p className="text-sm text-gray-500 mt-1">
                                            {new Date(
                                                order.created_at
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <span
                                        className={`inline-flex w-fit px-3 py-1 rounded-full text-sm font-medium
                                            ${order.status === "Pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : order.status === "Shipped"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : order.status === "Delivered"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                            }
                                        `}
                                    >
                                        {order.status}
                                    </span>
                                </div>

                                <div className="border-t border-gray-100 my-5"></div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Total Price
                                        </p>

                                        <p className="font-semibold text-lg mt-1">
                                            ৳{Number(order.total_price).toLocaleString()}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Payment Method
                                        </p>

                                        <p className="font-medium mt-1">
                                            {order.payment_method}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Shipping Address
                                        </p>

                                        <p className="font-medium mt-1">
                                            {order.shipping_address}
                                        </p>
                                    </div>

                                </div>
                            </div>
                        ))}

                    </div>
                )}

            </div>
        </div>
    );
}