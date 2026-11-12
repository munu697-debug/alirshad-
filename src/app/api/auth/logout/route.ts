import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json({ success: true });

    // Clear admin and user session cookies
    response.cookies.delete("admin_auth");
    response.cookies.delete("user_session");

    // Clear Supabase session if any
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
