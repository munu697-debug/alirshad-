import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password).trim();

    // Check against server-side environment variables (kept secret from browser)
    const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const adminPassword = (process.env.ADMIN_PASSWORD || "").trim();

    if (adminEmail && adminPassword && cleanEmail === adminEmail && cleanPassword === adminPassword) {
      const response = NextResponse.json({
        success: true,
        role: "admin",
        redirect: "/dashboard",
      });

      // Set secure authentication cookie
      response.cookies.set("admin_auth", "true", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return response;
    }

    // Otherwise, check Supabase Auth for standard users/authors
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (!error && data?.user) {
        return NextResponse.json({
          success: true,
          role: "user",
          redirect: "/dashboard",
        });
      }
    } catch {
      // Supabase auth fallback
    }

    return NextResponse.json(
      { error: "Invalid email or password. Please verify your credentials." },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
