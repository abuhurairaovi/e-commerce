"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

const statusColor = {
    Pending: "bg-yellow-500/15 text-yellow-400",
    Shipped: "bg-blue-500/15 text-blue-400",
    Delivered: "bg-[#22c55e]/15 text-[#22c55e]",
    Cancelled: "bg-red-500/15 text-red-400",
};

const statusOption = ["All", "Pending", "Shipped", "Delivered", "Cancelled"];

export default function OrderPages() {

    const { token } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        if (!token) return;

        const fetchOrders = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
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
            } catch (err) {
                console.error(err);
                setError("Server এর সাথে যোগাযোগ করা যাচ্ছে না।");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token]);

    const filtered = filter === "All" ? orders : orders.filter((o) => o.status === filter)

    async function updateStatus(id, status) {
        // আগে UI তে সাথে সাথে বদলে দিচ্ছি (optimistic update)
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status }),
                }
            );

            if (!res.ok) {
                throw new Error("Status update failed");
            }
        } catch (err) {
            console.error(err);
            alert("Status update ব্যর্থ হয়েছে, আবার চেষ্টা করুন।");
            // চাইলে এখানে আগের status এ ফিরিয়ে নেওয়া যায়, আপাতত simple রাখা হলো
        }
    }

    if (loading) {
        return <p className="text-black">Loading orders...</p>;
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
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors${filter === status ? "bg-[#22c55e] text-black"
                            : "bg-[#0f1420] border border-gray-500 text-black hover:text-green-400"
                            }`}


                    >

                        {status === "All" ? "সবগুলো" : status}


                    </button>

                ))}

            </div>

            <div className="bg-white  border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>

                            <tr className="text-left text-black border-b border-white/10">

                                <th className="px-4 py-3 font-medium">Order ID</th>
                                <th className="px-5 py-3 font-medium">Customrs</th>
                                <th className="px-5 py-3 font-medium">Date</th>
                                <th className="px-5 py-3 font-medium">Total</th>
                                <th className="px-5 py-3 font-medium">Status</th>


                            </tr>



                        </thead>


                        <tbody>

                            {filtered.map((order) => (
                                <tr key={order.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                                    <td className="px-5 py-3 text-black font-medium">{order.id}</td>

                                    <td className="px-5 py-3 text-black">{order.customer || "N/A"}</td>
                                    <td className="px-5 py-3 text-black">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-5 py-3 text-black">৳{Number(order.total_price).toLocaleString("en-BD")}</td>
                                    <td className="px-5 py-3">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            className={`text-xs px-2.5 py-1.5 rounded-full border-0 focus:outline-none focus:ring-1 focus:ring-[#22c55e] cursor-pointer ${statusColor[order.status]}`}
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
                                    <td colSpan={5} className="px-5 py-10 text-center text-green-400">
                                        এই স্ট্যাটাসে কোনো অর্ডার নেই
                                    </td>
                                </tr>
                            )}



                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    )
}