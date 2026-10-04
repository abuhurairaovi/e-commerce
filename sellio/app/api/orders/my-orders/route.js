import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { verifyUser } from "@/utils/verifyUser";

export const dynamic = "force-dynamic";

export async function GET(request) {
    const auth = await verifyUser(request);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { data: orders, error } = await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("user_id", auth.user.id)
        .order("id", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (orders.length === 0) return NextResponse.json({ orders: [] });

    const orderIds = orders.map((o) => o.id);
    const { data: items } = await supabaseAdmin
        .from("order_items")
        .select("*")
        .in("order_id", orderIds);

    const productIds = [...new Set((items || []).map((i) => i.product_id))];
    const { data: products } = await supabaseAdmin
        .from("products")
        .select("id, name")
        .in("id", productIds.length ? productIds : [0]);

    const nameMap = Object.fromEntries((products || []).map((p) => [p.id, p.name]));

    const result = orders.map((o) => ({
        ...o,
        items: (items || [])
            .filter((i) => i.order_id === o.id)
            .map((i) => ({ ...i, name: nameMap[i.product_id] || "Product" })),
    }));

    return NextResponse.json({ orders: result });
}