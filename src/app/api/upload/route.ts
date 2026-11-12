import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const uploaded = await uploadToCloudinary(base64, "alirshad_articles");

    return NextResponse.json({
      success: true,
      url: uploaded?.url,
      public_id: uploaded?.public_id,
    });
  } catch (error: any) {
    console.error("Upload API route error:", error);
    return NextResponse.json(
      { error: error?.message || "Image upload failed" },
      { status: 500 }
    );
  }
}
