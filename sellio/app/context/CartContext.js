"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "@/app/context/AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, token } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchCart = useCallback(async () => {
    if (!user || !token || !user.customerId) {
      setCart([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/cart/${user.customerId}`, {
        headers: authHeaders,
      });
      const data = await res.json();
      setCart(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product, quantity) => {
    if (!user || !token || !user.customerId) {
      return { error: "login_required" };
    }

    try {
      const res = await fetch(`${apiUrl}/api/cart`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          customerId: user.customerId,
          productId: product.id,
          quantity,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.message || "Failed to add to cart" };
      }

      await fetchCart();
      return { success: true };
    } catch (err) {
      console.error(err);
      return { error: "Server error" };
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return;

    try {
      const res = await fetch(`${apiUrl}/api/cart/${cartItemId}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ quantity }),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error(data.message);
        return;
      }

      await fetchCart();
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const res = await fetch(`${apiUrl}/api/cart/${cartItemId}`, {
        method: "DELETE",
        headers: authHeaders,
      });

      if (!res.ok) {
        const data = await res.json();
        console.error(data.message);
        return;
      }

      await fetchCart();
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const clearCart = async () => {
    if (!user || !token || !user.customerId) return;

    try {
      await fetch(`${apiUrl}/api/cart/customer/${user.customerId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      setCart([]);
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}