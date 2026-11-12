import { NextRequest, NextResponse } from "next/server";
import { getIssues, saveIssue } from "@/lib/db-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const publishedOnly = searchParams.get("published") === "true";
    const issues = await getIssues({ publishedOnly });
    return NextResponse.json({ issues });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title || !body.cover_image) {
      return NextResponse.json({ error: "Title and Cover Image are required" }, { status: 400 });
    }

    // Auto-generate slug if not provided
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const issue = await saveIssue({
      ...body,
      slug,
    });

    if (!issue) {
      return NextResponse.json({ error: "Failed to create issue" }, { status: 500 });
    }

    return NextResponse.json({ success: true, issue }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
