
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const CATEGORIES = [
  { name: "MEN", href: "/category/men" },
  { name: "WOMEN", href: "/category/women" },
  { name: "KIDS", href: "/category/kids" },
  { name: "ELECTRONICS", href: "/category/electronics" },
];

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 py-20 text-center sm:px-6">
        <h1 className="max-w-2xl text-3xl font-extrabold text-gray-900 md:text-5xl animate-fade-up">
          Everything You Need,{" "}
          <span className="text-green-600">One Click Away</span>
        </h1>

        <p className="max-w-md text-sm text-gray-500 md:text-base">
          Discover the best deals on fashion, electronics and more — all in
          one place.
        </p>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6">
        <h2 className="mb-6 text-xl font-bold text-gray-900">
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="flex items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 px-4 py-8 text-sm font-semibold text-gray-900 transition duration-300 hover:bg-green-600 hover:text-white"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <h2 className="mx-auto mb-6 max-w-7xl px-5 text-xl font-bold text-gray-900 sm:px-6">
          Featured Products
        </h2>

        <div className="overflow-hidden">
          <div className="animate-scroll flex w-max gap-6 px-5 sm:px-6">
            {[...products, ...products].map((product, index) => (
              <Link
                key={`${product.id}-${index}`}
                href={`/products/${product.id}`}
                className="group w-56 flex-shrink-0 rounded-2xl border border-gray-200 bg-white p-4 transition duration-300 hover:border-green-600 hover:shadow-sm"
              >
                <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <p className="text-sm font-semibold text-gray-900 group-hover:text-green-600">
                  {product.name}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  ৳{product.price}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promo banner */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6">
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-green-600 px-4 py-16 text-center">
          <h2 className="text-2xl font-extrabold text-white">
            Up to 50% Off — Limited Time
          </h2>

          <p className="max-w-md text-sm text-white/80">
            Grab your favorite items before the offer ends.
          </p>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-xl font-bold text-gray-900">
            Get updates on new arrivals & offers
          </h2>
        </div>
      </section>
    </main>
  );
}

