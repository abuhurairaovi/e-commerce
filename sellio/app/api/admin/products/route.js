import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { verifyAdmin } from "@/utils/verifyUser";

export const dynamic = "force-dynamic";

const DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200";

export async function GET(request) {
    const auth = await verifyAdmin(request);
    if (auth.error) {
        return NextResponse.json({ message: auth.error }, { status: auth.status });
    }

    const { data, error } = await supabaseAdmin
        .from("products")
        .select("id, name, price, stock, image")
        .order("id", { ascending: false });

    if (error) {
        console.error("products GET error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
}

export async function POST(request) {
    const auth = await verifyAdmin(request);
    if (auth.error) {
        return NextResponse.json({ message: auth.error }, { status: auth.status });
    }

    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
    }

    const name = String(body.name || "").trim();
    const price = Number(body.price);
    const stock = Number(body.stock ?? 0);

    if (!name || !Number.isFinite(price) || price < 0) {
        return NextResponse.json({ message: "নাম ও সঠিক দাম দিন।" }, { status: 400 });
    }
    if (!Number.isInteger(stock) || stock < 0) {
        return NextResponse.json({ message: "সঠিক stock দিন।" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
        .from("products")
        .insert({ name, price, stock, image: body.image || DEFAULT_IMAGE })
        .select("id, name, price, stock, image")
        .single();

    if (error) {
        console.error("products POST error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
}