import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { verifyAdmin } from "@/utils/verifyUser";

export const dynamic = "force-dynamic";

export async function GET(request) {
    const auth = await verifyAdmin(request);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const [orders, products, customers] = await Promise.all([
        supabaseAdmin.from("orders").select("*").order("created_at", { ascending: false }),
        supabaseAdmin.from("products").select("id, name, price, stock"),
        supabaseAdmin.from("customers").select("*"),
    ]);

    const error = orders.error || products.error || customers.error;
    if (error) {
        console.error("dashboard error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
        orders: orders.data,
        products: products.data,
        customers: customers.data,
    });
}