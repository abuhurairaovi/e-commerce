import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { verifyUser } from "@/utils/verifyUser";

export async function POST(request) {
  try {
    const auth = await verifyUser(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { shippingAddress, cartItems, paymentMethod, phone } = body;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // দাম server থেকেই হিসাব হচ্ছে
    const ids = cartItems.map((i) => i.productId || i.product_id);
    const { data: dbProducts, error: pErr } = await supabaseAdmin
      .from("products")
      .select("id, price")
      .in("id", ids);

    if (pErr) return NextResponse.json({ error: pErr.message }, { status: 400 });

    const priceMap = Object.fromEntries(dbProducts.map((p) => [p.id, Number(p.price)]));

    const items = cartItems.map((i) => {
      const pid = i.productId || i.product_id;
      return {
        product_id: pid,
        quantity: Number(i.quantity),
        price: priceMap[pid] ?? 0,
      };
    });

    const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert([
        {
          user_id: auth.user.id,
          total_price: totalPrice,
          shipping_address: shippingAddress,
          phone: phone || "N/A",
          payment_method: paymentMethod,
          status: "Pending",
        },
      ])
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 400 });
    }

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(items.map((i) => ({ ...i, order_id: order.id })));

    if (itemsError) {
      await supabaseAdmin.from("orders").delete().eq("id", order.id);
      return NextResponse.json({ error: itemsError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}