import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

// Handle POST /api/upload
export async function POST(request: Request) {
  try {
    // Read the multipart/form-data body
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Make a unique-ish filename in blob storage
    const blobName = `players/${Date.now()}-${file.name}`;

    // Upload file bytes to Vercel Blob
    const blob = await put(blobName, file, {
      access: "public", // public URL from CDN
      token: process.env.BLOB_READ_WRITE_TOKEN, // provided via .env.local or Vercel project env
    });

    // Respond with the URL so the client can display it
    return NextResponse.json({
      url: blob.url,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
