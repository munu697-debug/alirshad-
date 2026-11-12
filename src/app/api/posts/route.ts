import { NextRequest, NextResponse } from "next/server";
import { getPosts, savePost } from "@/lib/db-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const author = searchParams.get("author") || undefined;
    const status = (searchParams.get("status") as any) || "published";
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    const posts = await getPosts({
      categorySlug: category,
      authorName: author,
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
    const body = await req.json();
    if (!body.title || !body.content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const saved = await savePost(body);
    return NextResponse.json({ success: true, post: saved }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
