"use client";

import { useState, useEffect, use } from "react";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProductDetail({ params }) {
    const { id } = use(params);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const { addToCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
                    { cache: "no-store" }
                );

                if (!res.ok) {
                    setProduct(null);
                } else {
                    const data = await res.json();
                    setProduct(data);
                }
            } catch (err) {
                console.error("Failed to fetch product:", err);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [id]);

    if (loading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    if (!product) {
        return <p className="text-center mt-10">Product পাওয়া যায়নি</p>;
    }

    const handleDecrease = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    };

    const handleIncrease = () => {
        setQuantity((prev) => (prev < product.stock ? prev + 1 : prev));
    };

    const handleAddToCart = async () => {
        if (!user) {
            alert("Cart এ যোগ করতে হলে আগে Login করুন");
            router.push("/login");
            return;
        }

        setAdding(true);
        const result = await addToCart(product, quantity);
        setAdding(false);

        if (result?.error) {
            alert(result.error === "login_required"
                ? "Cart এ যোগ করতে হলে আগে Login করুন"
                : result.error);
            return;
        }

        alert(`${quantity} pcs of ${product.name} cart এ যোগ হয়েছে!`);
    };

    const handleBuyNow = async () => {
        if (!user) {
            alert("Order করতে হলে আগে Login করুন");
            router.push("/login");
            return;
        }

        setAdding(true);
        const result = await addToCart(product, quantity);
        setAdding(false);

        if (result?.error) {
            alert(result.error);
            return;
        }

        router.push("/checkout");
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="relative w-[400px] h-[400px]">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="400px"
                    className="rounded-lg object-cover"
                />
            </div>

            <h1 className="text-2xl font-bold mt-4">{product.name}</h1>
            <p className="text-xl font-semibold mt-2">৳{product.price}</p>

            {product.stock > 0 ? (
                <p className="text-green-600 mt-2">স্টকে আছে: {product.stock} পিস</p>
            ) : (
                <p className="text-red-600 mt-2 font-semibold">স্টক নেই</p>
            )}

            {product.stock > 0 && (
                <div className="flex items-center gap-4 mt-4">
                    <button
                        onClick={handleDecrease}
                        className="w-9 h-9 border rounded-md text-lg font-bold hover:bg-gray-100"
                    >
                        −
                    </button>
                    <span className="text-lg font-medium">{quantity}</span>
                    <button
                        onClick={handleIncrease}
                        className="w-9 h-9 border rounded-md text-lg font-bold hover:bg-gray-100"
                    >
                        +
                    </button>
                </div>
            )}

            <div className="flex gap-3 mt-6">
                <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || adding}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold ${product.stock === 0
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-white border-2 border-black text-black hover:bg-gray-100"
                        }`}
                >
                    {adding ? "যোগ হচ্ছে..." : "Add to Cart"}
                </button>

                <button
                    onClick={handleBuyNow}
                    disabled={product.stock === 0 || adding}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white ${product.stock === 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-black hover:bg-gray-800"
                        }`}
                >
                    {product.stock === 0 ? "Out of Stock" : "Buy Now"}
                </button>
            </div>
        </div>
    );
}