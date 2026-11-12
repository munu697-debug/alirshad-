"use client";

const MAX_DIMENSION = 2000;

/** Downscale and re-encode big photos in the browser so the upload is a fraction of the size. */
async function compressImage(file: File): Promise<File | Blob> {
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 500 * 1024) return file;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/webp", 0.85));
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

/** Uploads an image; goes direct to Cloudinary, falling back to the server route. Returns the URL. */
export async function uploadImage(file: File): Promise<string> {
  const body = await compressImage(file);

  try {
    const signRes = await fetch("/api/upload/sign", { method: "POST" });
    if (signRes.ok) {
      const s = await signRes.json();
      const fd = new FormData();
      fd.append("file", body);
      fd.append("api_key", s.apiKey);
      fd.append("timestamp", String(s.timestamp));
      fd.append("signature", s.signature);
      fd.append("folder", s.folder);
      const up = await fetch(`https://api.cloudinary.com/v1_1/${s.cloudName}/image/upload`, {
        method: "POST",
        body: fd,
      });
      const data = await up.json();
      if (data.secure_url) return data.secure_url as string;
    }
  } catch {
    // fall through to server upload
  }

  const fd = new FormData();
  fd.append("file", body);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const data = await res.json();
  if (!data.url) throw new Error(data.error || "Upload failed");
  return data.url as string;
}
