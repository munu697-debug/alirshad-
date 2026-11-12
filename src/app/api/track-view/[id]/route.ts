import { NextRequest, NextResponse } from "next/server";
import { incrementViews } from "@/lib/db-service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const views = await incrementViews(id);
    return NextResponse.json({ success: true, views });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
