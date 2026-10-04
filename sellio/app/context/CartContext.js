"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { supabase } from "@/utils/supabase";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Supabase Auth এর uuid
  const userId = user?.id;

  const fetchCart = useCallback(async () => {
    if (!userId) {
      setCart([]);
      return;
    }

    setLoading(true);
    try {
      // ১. ইউজারের কার্ট আইটেম
      const { data: cartItems, error: cartError } = await supabase
        .from("cart")
        .select("id, quantity, product_id")
        .eq("user_id", userId);

      if (cartError) {
        console.error("Failed to fetch cart:", cartError);
        setCart([]);
        return;
      }

      if (!cartItems || cartItems.length === 0) {
        setCart([]);
        return;
      }

      // ২. সেই প্রোডাক্টগুলোর তথ্য
      const productIds = cartItems.map((item) => item.product_id);

      const { data: productsData, error: productError } = await supabase
        .from("products")
        .select("id, name, price, image, stock")
        .in("id", productIds);

      if (productError) {
        console.error("Failed to fetch products for cart:", productError);
      }

      // ৩. একসাথে জোড়া
      const formattedCart = cartItems.map((item) => {
        const product = productsData?.find((p) => p.id === item.product_id);
        return {
          cartItemId: item.id,
          productId: item.product_id,
          name: product?.name || "Product",
          price: product?.price || 0,
          image: product?.image || "",
          stock: product?.stock || 0,
          quantity: item.quantity,
        };
      });

      setCart(formattedCart);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product, quantity) => {
    if (!userId) {
      return { error: "login_required" };
    }

    try {
      const { data: existingItems, error: checkError } = await supabase
        .from("cart")
        .select("id, quantity")
        .eq("user_id", userId)
        .eq("product_id", product.id);

      if (checkError) {
        console.error("Check error:", checkError);
        return { error: checkError.message };
      }

      if (existingItems && existingItems.length > 0) {
        const existingItem = existingItems[0];
        const newQty = existingItem.quantity + quantity;

        const { error: updateError } = await supabase
          .from("cart")
          .update({ quantity: newQty })
          .eq("id", existingItem.id);

        if (updateError) return { error: updateError.message };
      } else {
        const { error: insertError } = await supabase.from("cart").insert([
          {
            user_id: userId,
            product_id: product.id,
            quantity: quantity,
          },
        ]);

        if (insertError) return { error: insertError.message };
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
      const { error } = await supabase
        .from("cart")
        .update({ quantity })
        .eq("id", cartItemId);

      if (error) {
        console.error(error.message);
        return;
      }

      await fetchCart();
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("id", cartItemId);

      if (error) {
        console.error(error.message);
        return;
      }

      await fetchCart();
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const clearCart = async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("user_id", userId);

      if (error) {
        console.error(error.message);
        return;
      }

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