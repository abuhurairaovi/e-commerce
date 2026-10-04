import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { verifyAdmin } from "@/utils/verifyUser";

export const dynamic = "force-dynamic";

export async function GET(request) {
    const auth = await verifyAdmin(request);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const [orders, users] = await Promise.all([
        supabaseAdmin.from("orders").select("*").order("id", { ascending: false }),
        supabaseAdmin.from("users").select("*"),
    ]);

    const error = orders.error || users.error;
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const userMap = Object.fromEntries(
        users.data.map((u) => [u.id, u.name || u.email || `User #${u.id}`])
    );

    const result = orders.data.map((o) => ({
        ...o,
        customer: userMap[o.user_id] || `User #${o.user_id}`,
    }));

    return NextResponse.json({ orders: result });
}