import { supabaseAdmin } from "@/utils/supabaseAdmin";

export async function verifyUser(request) {
    const auth = request.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
        return { error: "Unauthorized", status: 401 };
    }

    const token = auth.split(" ")[1];

    const { data, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !data?.user?.email) {
        return { error: "Invalid token", status: 401 };
    }

    // case-insensitive ইমেইল মিল (_ % \ এস্কেপ করা)
    const email = data.user.email.toLowerCase().replace(/[\\%_]/g, "\\$&");

    const { data: rows, error } = await supabaseAdmin
        .from("users")
        .select("id, role, email")
        .ilike("email", email)
        .limit(1);

    if (error) {
        console.error("verifyUser error:", error.message);
        return { error: "User lookup failed", status: 500 };
    }
    if (!rows || rows.length === 0) {
        return { error: "User not found", status: 401 };
    }

    return { user: rows[0] };
}

export async function verifyAdmin(request) {
    const result = await verifyUser(request);
    if (result.error) return result;
    if (result.user.role !== "admin") {
        return { error: "Forbidden", status: 403 };
    }
    return result;
}