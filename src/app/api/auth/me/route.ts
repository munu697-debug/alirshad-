import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth";

const anon = { authenticated: false, user: null, role: null };

export async function GET(req: NextRequest) {
  try {
    // Admin: only a validly signed session counts.
    const admin = await verifyAdminToken(req.cookies.get(ADMIN_COOKIE)?.value);
    if (admin) {
      return NextResponse.json({
        authenticated: true,
        role: "admin",
        user: { email: admin.email, name: "Admin", initial: "A", role: "admin" },
      });
    }

    // Readers: trust only the verified Supabase session, never client-readable cookies.
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const displayName =
          user.user_metadata?.display_name || user.email?.split("@")[0] || "Reader";
        return NextResponse.json({
          authenticated: true,
          role: "user",
          user: {
            id: user.id,
            email: user.email,
            name: displayName,
            initial: displayName.charAt(0).toUpperCase(),
            role: "user",
          },
        });
      }
    } catch {
      // Supabase session not available
    }

    return NextResponse.json(anon);
  } catch {
    return NextResponse.json(anon);
  }
}
