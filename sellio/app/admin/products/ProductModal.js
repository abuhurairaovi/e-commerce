"use client";

import { useState } from "react";

export default function ProductModal({ product, onClose, onSave }) {
    const [form, setForm] = useState({
        name: product?.name || "",
        price: product?.price || "",
        stock: product?.stock ?? "",
        image: product?.image || "",
    });
    const [errors, setErrors] = useState({});

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    function validate() {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = "প্রোডাক্টের নাম লিখতে হবে";
        if (!form.price || Number(form.price) <= 0) newErrors.price = "সঠিক দাম লিখো";
        if (form.stock === "" || form.stock < 0) newErrors.stock = "সঠিক স্টক সংখ্যা লিখো";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!validate()) return;
        onSave({
            ...form,
            price: String(form.price),
            stock: Number(form.stock),
            image:
                form.image ||
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200",
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />

            <div className="relative bg-white border border-black/10 rounded-xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-semibold text-black">
                        {product ? "প্রোডাক্ট এডিট করো" : "নতুন প্রোডাক্ট যোগ করো"}
                    </h2>
                    <button onClick={onClose} className="text-black/40 hover:text-black">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-black/60 mb-1.5">প্রোডাক্টের নাম</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="যেমন: Wireless Headphones"
                            className="w-full bg-white border border-black/10 rounded-lg px-3 py-2.5 text-sm text-black placeholder-black/25 focus:outline-none focus:border-[#22c55e]/50"
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-black/60 mb-1.5">দাম (৳)</label>
                            <input
                                name="price"
                                type="number"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="1500"
                                className="w-full bg-white border border-black/10 rounded-lg px-3 py-2.5 text-sm text-black placeholder-black/25 focus:outline-none focus:border-[#22c55e]/50"
                            />
                            {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                        </div>
                        <div>
                            <label className="block text-sm text-black/60 mb-1.5">স্টক (পিস)</label>
                            <input
                                name="stock"
                                type="number"
                                value={form.stock}
                                onChange={handleChange}
                                placeholder="10"
                                className="w-full bg-white border border-black/10 rounded-lg px-3 py-2.5 text-sm text-black placeholder-black/25 focus:outline-none focus:border-[#22c55e]/50"
                            />
                            {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-black/60 mb-1.5">ছবির URL (ঐচ্ছিক)</label>
                        <input
                            name="image"
                            value={form.image}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="w-full bg-white border border-black/10 rounded-lg px-3 py-2.5 text-sm text-black placeholder-black/25 focus:outline-none focus:border-[#22c55e]/50"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-black/70 border border-black/10 hover:bg-black/5 transition-colors"
                        >
                            বাতিল
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-[#22c55e] text-black hover:bg-[#1ea34e] transition-colors"
                        >
                            {product ? "Update" : "Add"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}