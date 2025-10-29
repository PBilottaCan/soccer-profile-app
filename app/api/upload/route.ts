import { NextResponse } from "next/server";
// @ts-expect-error: we'll rely on runtime lib typing from @vercel/blob
import { put } from "@vercel/blob";

// Handle POST /api/upload
export async function POST(request: Request) {
  try {
    // Read multipart/form-data from the request
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Generate a filename in blob storage
    const blobName = `players/${Date.now()}-${file.name}`;

    // Upload the binary to Vercel Blob.
    // access: "public" means the returned .url is a public CDN URL.
    const blob = await put(blobName, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({
      url: blob.url, // this is the permanent URL for the image
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
