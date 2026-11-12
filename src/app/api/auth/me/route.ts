import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const adminAuth = cookieStore.get("admin_auth")?.value;
    const userSessionRaw = cookieStore.get("user_session")?.value;

    const adminEmail = (process.env.ADMIN_EMAIL || "alirshadmagazine@gmail.com").trim().toLowerCase();

    // Check admin first
    if (adminAuth === "true") {
      return NextResponse.json({
        authenticated: true,
        role: "admin",
        user: {
          email: adminEmail,
          name: "Admin",
          initial: "A",
          role: "admin",
        },
      });
    }

    // Check user_session cookie
    if (userSessionRaw) {
      try {
        const parsed = JSON.parse(decodeURIComponent(userSessionRaw));
        if (parsed && parsed.email) {
          return NextResponse.json({
            authenticated: true,
            role: parsed.role || "user",
            user: {
              email: parsed.email,
              name: parsed.name || parsed.email.split("@")[0],
              initial: parsed.initial || (parsed.name || parsed.email)[0].toUpperCase(),
              role: parsed.role || "user",
            },
          });
        }
      } catch {
        // ignore json parse error
      }
    }

    // Check Supabase server session
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const isUserAdmin = user.email?.toLowerCase() === adminEmail;
        const displayName = user.user_metadata?.display_name || user.email?.split("@")[0] || "Reader";
        const initial = displayName.charAt(0).toUpperCase();

        return NextResponse.json({
          authenticated: true,
          role: isUserAdmin ? "admin" : "user",
          user: {
            id: user.id,
            email: user.email,
            name: displayName,
            initial,
            role: isUserAdmin ? "admin" : "user",
          },
        });
      }
    } catch {
      // Supabase session not available
    }

    return NextResponse.json({
      authenticated: false,
      user: null,
      role: null,
    });
  } catch (error: any) {
    return NextResponse.json({
      authenticated: false,
      user: null,
      role: null,
    });
  }
}
