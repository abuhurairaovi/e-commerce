import { createClient } from "@supabase/supabase-js";

// শুধু server-side এ ব্যবহার করুন। client component এ import করবেন না।
export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
);