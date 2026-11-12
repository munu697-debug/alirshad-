import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { clientIp, rateLimit } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    if (!rateLimit(`signup:${clientIp(req)}`, 5, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many sign-ups. Please try again later." },
        { status: 429 }
      );
    }

    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    if (String(password).length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const displayName = String(name || cleanEmail.split("@")[0]).trim();
    const initial = displayName.charAt(0).toUpperCase();

    const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    if (adminEmail && cleanEmail === adminEmail) {
      return NextResponse.json({ error: "This email cannot be registered." }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Create or register user in Supabase auth.users with auto-confirmed email
    let userId: string;
    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
      email: cleanEmail,
      password: String(password).trim(),
      email_confirm: true, // auto-confirm email so they can log in immediately
      user_metadata: {
        display_name: displayName,
      },
    });

    if (createError) {
      // If user already exists in auth, check if we can update profile
      if (createError.message.toLowerCase().includes("already registered") || createError.message.toLowerCase().includes("already exists")) {
        return NextResponse.json(
          { error: "This email is already registered. Please log in instead." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: createError.message },
        { status: 400 }
      );
    }

    userId = createData.user.id;

    // 2. Synchronize user into public.profiles
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: userId,
      email: cleanEmail,
      display_name: displayName,
      role: "reader",
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      console.warn("Could not upsert profile:", profileError.message);
    }

    // 3. Add to newsletter subscribers list
    await supabase.from("subscribers").upsert({
      email: cleanEmail,
      status: "active",
    }, { onConflict: "email" });

    // 4. Establish a real Supabase session so the user is actually authenticated
    try {
      const userClient = await createClient();
      await userClient.auth.signInWithPassword({ email: cleanEmail, password: String(password).trim() });
    } catch {
      // user can still log in manually
    }

    const response = NextResponse.json({
      success: true,
      message: "Account created successfully!",
      user: {
        id: userId,
        email: cleanEmail,
        name: displayName,
        initial,
        role: "reader",
      },
      redirect: "/",
    });

    response.cookies.set("user_session", JSON.stringify({
      email: cleanEmail,
      name: displayName,
      role: "reader",
      initial,
    }), {
      path: "/",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // Ensure admin cookie is not set for regular readers
    response.cookies.delete("admin_session");

    return response;
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
