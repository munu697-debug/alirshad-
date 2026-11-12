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

    // Check against server-side environment variables for the unique admin account
    const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const adminPassword = (process.env.ADMIN_PASSWORD || "").trim();

    // 1. Admin Login (Sole manager who has access to /dashboard)
    if (adminEmail && adminPassword && cleanEmail === adminEmail && cleanPassword === adminPassword) {
      const response = NextResponse.json({
        success: true,
        role: "admin",
        redirect: "/dashboard",
        user: {
          email: adminEmail,
          name: "Admin",
          initial: "A",
          role: "admin",
        },
      });

      // Set secure admin authentication cookie
      response.cookies.set("admin_auth", "true", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      // Set user session cookie for UI navbar
      response.cookies.set("user_session", JSON.stringify({
        email: adminEmail,
        name: "Admin",
        role: "admin",
        initial: "A",
      }), {
        path: "/",
        httpOnly: false, // accessible to client for fast navbar display
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
      });

      return response;
    }

    // 2. Standard User / Reader Login (Via Supabase Auth)
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (!error && data?.user) {
        const displayName = data.user.user_metadata?.display_name || cleanEmail.split("@")[0] || "Reader";
        const initial = displayName.charAt(0).toUpperCase();

        const response = NextResponse.json({
          success: true,
          role: "user",
          redirect: "/", // Readers go to Homepage, NOT Dashboard!
          user: {
            id: data.user.id,
            email: data.user.email,
            name: displayName,
            initial,
            role: "user",
          },
        });

        // Ensure admin cookie is REMOVED if previously present
        response.cookies.delete("admin_auth");

        // Set user session cookie for UI navbar
        response.cookies.set("user_session", JSON.stringify({
          email: data.user.email,
          name: displayName,
          role: "user",
          initial,
        }), {
          path: "/",
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30,
        });

        return response;
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
