import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { verifyAdmin } from "@/utils/verifyUser";

const ALLOWED = ["Pending", "Shipped", "Delivered", "Cancelled"];

export async function PUT(request, { params }) {
    const auth = await verifyAdmin(request);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    const { status } = await request.json();

    if (!ALLOWED.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
        .from("orders")
        .update({ status })
        .eq("id", id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}