import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/auth";

// Returns a short-lived signature so the browser can upload straight to Cloudinary
// (skipping the slow browser -> Vercel -> Cloudinary double transfer).
export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const cfg = cloudinary.config();
  if (!cfg.cloud_name || !cfg.api_key || !cfg.api_secret) {
    return NextResponse.json({ error: "Cloudinary not configured" }, { status: 501 });
  }

  const folder = "alirshad_articles";
  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request({ folder, timestamp }, cfg.api_secret);

  return NextResponse.json({
    cloudName: cfg.cloud_name,
    apiKey: cfg.api_key,
    folder,
    timestamp,
    signature,
  });
}
