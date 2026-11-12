import { NextRequest, NextResponse } from "next/server";
import { toggleLike } from "@/lib/db-service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await toggleLike(id);
    return NextResponse.json({
      success: true,
      liked: result.liked,
      count: result.count,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
