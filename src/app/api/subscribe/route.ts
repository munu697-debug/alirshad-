import { NextRequest, NextResponse } from "next/server";
import { addSubscriber } from "@/lib/db-service";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const result = await addSubscriber(email);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
