"use client";

import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
    const { cart, totalPrice, clearCart } = useCart();
    const { user, token } = useAuth();
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        phone: "",
        address: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setError("");

        if (!user || !token) {
            router.push("/login");
            return;
        }

        if (!form.name || !form.phone || !form.address) {
            alert("সব তথ্য পূরণ করুন");
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    // customerId ও totalPrice পাঠানো হচ্ছে না:
                    // ব্যাকএন্ড token ও cart_items থেকে নিজেই বের করে নেয়
                    body: JSON.stringify({
                        paymentMethod:
                            paymentMethod === "cod"
                                ? "Cash on Delivery"
                                : "bKash",
                        shippingAddress: `${form.name}, ${form.phone}, ${form.address}`,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Order place করা যায়নি");
                setSubmitting(false);
                return;
            }

            alert("আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে!");

            await clearCart();
            router.push("/");
        } catch (err) {
            console.error(err);
            setError("Server এর সাথে যোগাযোগ করা যাচ্ছে না");
        } finally {
            setSubmitting(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="max-w-2xl mx-auto p-6 text-center">
                <p className="text-gray-600">
                    আপনার কার্টে কোনো প্রোডাক্ট নেই।
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>

            {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-md mb-4">
                    {error}
                </div>
            )}

            {/* Order Summary */}
            <div className="border rounded-lg p-4 mb-6">
                <h2 className="font-semibold mb-3">আপনার অর্ডার</h2>

                {cart.map((item) => (
                    <div
                        key={item.id}
                        className="flex justify-between text-sm mb-2"
                    >
                        <span>
                            {item.name} × {item.quantity}
                        </span>

                        <span>
                            ৳{Number(item.price) * item.quantity}
                        </span>
                    </div>
                ))}

                <div className="border-t mt-3 pt-3 flex justify-between font-bold">
                    <span>Total</span>
                    <span>৳{totalPrice}</span>
                </div>
            </div>

            {/* Shipping Form */}
            <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        পুরো নাম
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2"
                        placeholder="আপনার নাম লিখুন"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        ফোন নম্বর
                    </label>

                    <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2"
                        placeholder="01XXXXXXXXX"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        ঠিকানা
                    </label>

                    <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2"
                        rows={3}
                        placeholder="বাসা/রোড/এলাকা/শহর"
                    />
                </div>

                {/* Payment Method */}
                <div className="border rounded-lg p-4">
                    <h2 className="font-semibold mb-3">
                        Payment Method
                    </h2>

                    <label className="flex items-center gap-3 mb-3 cursor-pointer">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            checked={paymentMethod === "cod"}
                            onChange={(e) =>
                                setPaymentMethod(e.target.value)
                            }
                        />
                        <span>Cash on Delivery</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="bkash"
                            checked={paymentMethod === "bkash"}
                            onChange={(e) =>
                                setPaymentMethod(e.target.value)
                            }
                        />
                        <span>bKash</span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-60"
                >
                    {submitting ? "Placing order..." : "Place Order"}
                </button>
            </form>
        </div>
    );
}