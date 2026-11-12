import { NextRequest, NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/auth";
import { addSubscriber } from "@/lib/db-service";

export async function POST(req: NextRequest) {
  try {
    if (!rateLimit(`sub:${clientIp(req)}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json({ success: false, message: "Too many requests." }, { status: 429 });
    }
    const { email } = await req.json();
    const result = await addSubscriber(email);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
