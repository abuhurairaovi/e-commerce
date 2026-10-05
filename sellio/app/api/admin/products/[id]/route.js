import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { verifyAdmin } from "@/utils/verifyUser";

export const dynamic = "force-dynamic";

function isValidImage(img) {
    if (!img) return true;
    const s = String(img);
    if (s.startsWith("data:image/")) return s.length <= 400000;
    if (/^https?:\/\//.test(s)) return s.length <= 2000;
    return false;
}

export async function PUT(request, { params }) {
    const auth = await verifyAdmin(request);
    if (auth.error) {
        return NextResponse.json({ message: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    const productId = Number(id);
    if (!Number.isInteger(productId)) {
        return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
    }

    const update = {};
    if (body.name !== undefined) {
        const name = String(body.name).trim();
        if (!name) return NextResponse.json({ message: "নাম দিন।" }, { status: 400 });
        update.name = name;
    }
    if (body.price !== undefined) {
        const price = Number(body.price);
        if (!Number.isFinite(price) || price < 0) {
            return NextResponse.json({ message: "সঠিক দাম দিন।" }, { status: 400 });
        }
        update.price = price;
    }
    if (body.stock !== undefined) {
        const stock = Number(body.stock);
        if (!Number.isInteger(stock) || stock < 0) {
            return NextResponse.json({ message: "সঠিক stock দিন।" }, { status: 400 });
        }
        update.stock = stock;
    }
    if (body.image) {
        if (!isValidImage(body.image)) {
            return NextResponse.json(
                { message: "ছবি অনেক বড় বা ভুল ফরম্যাট। আপলোড বাটন বা ছোট https URL ব্যবহার করুন।" },
                { status: 400 }
            );
        }
        update.image = body.image;
    }

    if (Object.keys(update).length === 0) {
        return NextResponse.json({ message: "কিছু বদলানোর নেই।" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
        .from("products")
        .update(update)
        .eq("id", productId)
        .select("id, name, price, stock, image")
        .single();

    if (error) {
        console.error("products PUT error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
}

export async function DELETE(request, { params }) {
    const auth = await verifyAdmin(request);
    if (auth.error) {
        return NextResponse.json({ message: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    const productId = Number(id);
    if (!Number.isInteger(productId)) {
        return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("products").delete().eq("id", productId);

    if (error) {
        console.error("products DELETE error:", error.message);
        const msg =
            error.code === "23503"
                ? "এই product কোনো order বা cart-এ আছে, তাই ডিলিট করা যাচ্ছে না।"
                : error.message;
        return NextResponse.json({ message: msg }, { status: 409 });
    }
    return NextResponse.json({ success: true });
}