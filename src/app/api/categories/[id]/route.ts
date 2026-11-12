import { NextRequest, NextResponse } from "next/server";
import { deleteCategory, saveCategory } from "@/lib/db-service";
import { requireAdmin } from "@/lib/auth";

function makeSlug(input: string): string {
  return input.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/(^-|-$)+/g, "");
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const { id } = await params;
    const body = await req.json();
    const name = String(body.name || "").trim();
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    const category = await saveCategory({
      id,
      name,
      slug: makeSlug(String(body.slug || name)),
      description: body.description ? String(body.description) : undefined,
      display_order: Number(body.display_order) || 0,
    });
    if (!category) return NextResponse.json({ error: "Could not update category" }, { status: 400 });
    return NextResponse.json({ success: true, category });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to update category" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const { id } = await params;
  const ok = await deleteCategory(id);
  if (!ok) return NextResponse.json({ error: "Could not delete category" }, { status: 400 });
  return NextResponse.json({ success: true });
}
