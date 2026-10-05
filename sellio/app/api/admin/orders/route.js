import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { verifyAdmin } from "@/utils/verifyUser";

export const dynamic = "force-dynamic";

export async function GET(request) {
    const auth = await verifyAdmin(request);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { data: orders, error } = await supabaseAdmin
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("admin orders GET error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const userIds = [...new Set(orders.map((o) => o.user_id).filter(Boolean))];
    let nameMap = {};
    if (userIds.length > 0) {
        const { data: users } = await supabaseAdmin
            .from("users")
            .select("id, name")
            .in("id", userIds);
        nameMap = Object.fromEntries((users || []).map((u) => [u.id, u.name]));
    }

    const result = orders.map((o) => ({
        ...o,
        customer: nameMap[o.user_id] || null,
    }));

    return NextResponse.json({ orders: result });
}