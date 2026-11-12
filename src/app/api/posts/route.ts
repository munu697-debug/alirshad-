import { NextRequest, NextResponse } from "next/server";
import { sanitizeArticleHtml } from "@/lib/sanitize";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { getPosts, savePost } from "@/lib/db-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const author = searchParams.get("author") || undefined;
    const issueId = searchParams.get("issueId") || undefined;
    const issueSlug = searchParams.get("issueSlug") || undefined;
    const coverStoryOnly = searchParams.get("coverStoryOnly") === "true";
    const status = (searchParams.get("status") as any) || "published";
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    const posts = await getPosts({
      categorySlug: category,
      authorName: author,
      issueId,
      issueSlug,
      coverStoryOnly,
      status,
      limit,
    });

    return NextResponse.json({ posts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const denied = await requireAdmin(req);
    if (denied) return denied;
    const body = await req.json();
    if (!body.title || !body.content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const slug = String(body.slug || "").trim() || `post-${Date.now()}`;
    const saved = await savePost({ ...body, slug, content: sanitizeArticleHtml(body.content) });
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, post: saved }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
