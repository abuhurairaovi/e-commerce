"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

export default function ProductPage() {
    const { token } = useAuth();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        stock: "",
        image: "",
    });

    // Edit modal এর state
    const [editingProduct, setEditingProduct] = useState(null);
    const [saving, setSaving] = useState(false);

    const fetchProducts = async () => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/products`
            );
            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Failed to load products.");
                setLoading(false);
                return;
            }

            setProducts(data);
        } catch (err) {
            console.error(err);
            setError("Server এর সাথে যোগাযোগ করা যাচ্ছে না।");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.price) return;

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name: newProduct.name,
                        price: Number(newProduct.price),
                        stock: Number(newProduct.stock) || 0,
                        image: newProduct.image || "https://via.placeholder.com/100",
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Product যোগ করা যায়নি।");
                return;
            }

            setProducts((prev) => [data, ...prev]);
            setNewProduct({ name: "", price: "", stock: "", image: "" });
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            alert("Server এর সাথে যোগাযোগ করা যাচ্ছে না।");
        }
    };

    // Edit modal খোলা
    const openEditModal = (product) => {
        setEditingProduct({
            id: product.id,
            name: product.name ?? "",
            price: String(product.price ?? ""),
            stock: String(product.stock ?? ""),
            image: product.image ?? "",
        });
    };

    // Edit সেভ করা
    const handleUpdateProduct = async () => {
        if (!editingProduct) return;

        if (
            !editingProduct.name ||
            editingProduct.price === "" ||
            editingProduct.stock === ""
        ) {
            alert("নাম, দাম ও stock দিন।");
            return;
        }

        if (
            Number(editingProduct.price) < 0 ||
            Number(editingProduct.stock) < 0
        ) {
            alert("দাম বা stock ঋণাত্মক হতে পারবে না।");
            return;
        }

        setSaving(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/products/${editingProduct.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name: editingProduct.name,
                        price: Number(editingProduct.price),
                        stock: Number(editingProduct.stock),
                        image: editingProduct.image || undefined,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Update করা যায়নি।");
                setSaving(false);
                return;
            }

            // তালিকায় শুধু ওই product বদলানো (category_name যেন হারিয়ে না যায়)
            setProducts((prev) =>
                prev.map((p) => (p.id === data.id ? { ...p, ...data } : p))
            );
            setEditingProduct(null);
        } catch (err) {
            console.error(err);
            alert("Server এর সাথে যোগাযোগ করা যাচ্ছে না।");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        const confirmDelete = confirm("আপনি কি নিশ্চিত এই প্রোডাক্টটি ডিলিট করতে চান?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                const data = await res.json();
                alert(data.message || "Delete করা যায়নি।");
                return;
            }

            setProducts((prev) => prev.filter((product) => product.id !== id));
        } catch (err) {
            console.error(err);
            alert("Server এর সাথে যোগাযোগ করা যাচ্ছে না।");
        }
    };

    if (loading) {
        return <p className="text-black">Loading products...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-black">
                        Products
                    </h1>
                    <p className="text-sm text-black/40 mt-1">
                        আপনার সব প্রোডাক্ট এখানে দেখুন
                    </p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#22c55e] text-black font-medium hover:bg-[#16a34a] transition-colors"
                >
                    + Add Product
                </button>
            </div>

            {/* Product Table */}
            <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-black/40 border-b border-black/10">
                                <th className="px-5 py-3 font-medium">
                                    Product
                                </th>

                                <th className="px-5 py-3 font-medium">
                                    Price
                                </th>

                                <th className="px-5 py-3 font-medium">
                                    Stock
                                </th>

                                <th className="px-5 py-3 font-medium">
                                    Status
                                </th>

                                <th className="px-5 py-3 font-medium">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-b border-black/5 last:border-0 hover:bg-black/[0.02]"
                                >
                                    {/* Product */}
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />

                                            <div>
                                                <p className="text-black font-medium">
                                                    {product.name}
                                                </p>

                                                <p className="text-xs text-black/40">
                                                    ID: {product.id}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Price */}
                                    <td className="px-5 py-3 text-black/70">
                                        ৳{Number(product.price).toLocaleString("en-BD")}
                                    </td>

                                    {/* Stock */}
                                    <td className="px-5 py-3 text-black/70">
                                        {product.stock}
                                    </td>

                                    {/* Status */}
                                    <td className="px-5 py-3">
                                        {product.stock === 0 ? (
                                            <span className="text-xs px-2.5 py-1.5 rounded-full bg-red-500/15 text-red-500">
                                                Out of Stock
                                            </span>
                                        ) : product.stock <= 3 ? (
                                            <span className="text-xs px-2.5 py-1.5 rounded-full bg-yellow-500/15 text-yellow-600">
                                                Low Stock
                                            </span>
                                        ) : (
                                            <span className="text-xs px-2.5 py-1.5 rounded-full bg-[#22c55e]/15 text-[#16a34a]">
                                                In Stock
                                            </span>
                                        )}
                                    </td>

                                    {/* Action */}
                                    <td className="px-5 py-3 space-x-2">
                                        <button
                                            className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => openEditModal(product)}
                                            className="text-sm text-green-600 hover:text-green-500 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product.id)}
                                            className="text-sm text-red-500 hover:text-red-600 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {products.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-5 py-10 text-center text-black/40"
                                    >
                                        কোনো প্রোডাক্ট নেই
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white border border-black/10 rounded-xl p-6 w-full max-w-md space-y-4">
                        <h2 className="text-lg font-semibold text-black">
                            নতুন প্রোডাক্ট যোগ করুন
                        </h2>

                        <input
                            type="text"
                            placeholder="Product Name"
                            value={newProduct.name}
                            onChange={(e) =>
                                setNewProduct({ ...newProduct, name: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-black/5 border border-black/10 text-black outline-none"
                        />

                        <input
                            type="number"
                            placeholder="Price"
                            value={newProduct.price}
                            onChange={(e) =>
                                setNewProduct({ ...newProduct, price: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-black/5 border border-black/10 text-black outline-none"
                        />

                        <input
                            type="number"
                            placeholder="Stock"
                            value={newProduct.stock}
                            onChange={(e) =>
                                setNewProduct({ ...newProduct, stock: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-black/5 border border-black/10 text-black outline-none"
                        />

                        <input
                            type="text"
                            placeholder="Image URL (ঐচ্ছিক)"
                            value={newProduct.image}
                            onChange={(e) =>
                                setNewProduct({ ...newProduct, image: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-black/5 border border-black/10 text-black outline-none"
                        />

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 rounded-xl text-black/70 hover:text-black transition-colors"
                            >
                                বাতিল
                            </button>

                            <button
                                onClick={handleAddProduct}
                                className="px-4 py-2 rounded-xl bg-[#22c55e] text-black font-medium hover:bg-[#16a34a] transition-colors"
                            >
                                Add Product
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {editingProduct && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white border border-black/10 rounded-xl p-6 w-full max-w-md space-y-4">
                        <h2 className="text-lg font-semibold text-black">
                            প্রোডাক্ট এডিট করুন (ID: {editingProduct.id})
                        </h2>

                        <div>
                            <label className="block text-xs text-black/50 mb-1">
                                নাম
                            </label>
                            <input
                                type="text"
                                value={editingProduct.name}
                                onChange={(e) =>
                                    setEditingProduct({ ...editingProduct, name: e.target.value })
                                }
                                className="w-full px-3 py-2 rounded-lg bg-black/5 border border-black/10 text-black outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-black/50 mb-1">
                                দাম (৳)
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={editingProduct.price}
                                onChange={(e) =>
                                    setEditingProduct({ ...editingProduct, price: e.target.value })
                                }
                                className="w-full px-3 py-2 rounded-lg bg-black/5 border border-black/10 text-black outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-black/50 mb-1">
                                Stock
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={editingProduct.stock}
                                onChange={(e) =>
                                    setEditingProduct({ ...editingProduct, stock: e.target.value })
                                }
                                className="w-full px-3 py-2 rounded-lg bg-black/5 border border-black/10 text-black outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-black/50 mb-1">
                                Image URL
                            </label>
                            <input
                                type="text"
                                value={editingProduct.image}
                                onChange={(e) =>
                                    setEditingProduct({ ...editingProduct, image: e.target.value })
                                }
                                className="w-full px-3 py-2 rounded-lg bg-black/5 border border-black/10 text-black outline-none"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={() => setEditingProduct(null)}
                                className="px-4 py-2 rounded-xl text-black/70 hover:text-black transition-colors"
                            >
                                বাতিল
                            </button>

                            <button
                                onClick={handleUpdateProduct}
                                disabled={saving}
                                className="px-4 py-2 rounded-xl bg-[#22c55e] text-black font-medium hover:bg-[#16a34a] transition-colors disabled:opacity-60"
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}