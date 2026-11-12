import { NextRequest, NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/auth";
import { getComments, addComment } from "@/lib/db-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("post_id");
    if (!postId) {
      return NextResponse.json({ error: "post_id is required" }, { status: 400 });
    }

    const comments = await getComments(postId);
    return NextResponse.json({ comments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!rateLimit(`comment:${clientIp(req)}`, 10, 10 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many comments. Slow down." }, { status: 429 });
    }
    const body = await req.json();
    if (typeof body.content === "string" && body.content.length > 5000) {
      return NextResponse.json({ error: "Comment too long" }, { status: 400 });
    }
    if (!body.post_id || !body.content) {
      return NextResponse.json({ error: "post_id and content are required" }, { status: 400 });
    }

    const comment = await addComment(body);
    return NextResponse.json({ success: true, comment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
