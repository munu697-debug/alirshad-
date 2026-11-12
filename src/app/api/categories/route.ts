import { NextRequest, NextResponse } from "next/server";
import { getCategories, saveCategory } from "@/lib/db-service";
import { requireAdmin } from "@/lib/auth";

function makeSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ categories });
  } catch {
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    const category = await saveCategory({
      name,
      slug: makeSlug(String(body.slug || name)) || `cat-${Date.now()}`,
      description: body.description ? String(body.description) : undefined,
      display_order: Number(body.display_order) || 0,
    });
    if (!category) {
      return NextResponse.json({ error: "Could not save (slug may already exist)" }, { status: 400 });
    }
    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to save category" }, { status: 400 });
  }
}
