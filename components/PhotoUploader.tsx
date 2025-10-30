"use client";

import { useRef, useState } from "react";

type PhotoUploaderProps = {
  initialPhotoUrl: string;
  onChange: (newUrl: string) => void;
};

export default function PhotoUploader({
  initialPhotoUrl,
  onChange,
}: PhotoUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState(initialPhotoUrl);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Local preview immediately using a blob URL in the browser
    const localPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(localPreviewUrl);

    // 2. Prepare form data for the API route
    const body = new FormData();
    body.append("file", file);

    setUploading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });

      if (!res.ok) {
        console.error("Upload failed:", await res.text());
        setUploading(false);
        return;
      }

      const data = await res.json();
      const hostedUrl = data.url as string;

      // 3. Update preview to the hosted URL from Blob
      setPreviewUrl(hostedUrl);

      // 4. Tell parent "use this URL from now on"
      onChange(hostedUrl);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  }

  function triggerFileDialog() {
    fileInputRef.current?.click();
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-red-800 bg-white shadow flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Player preview"
            className="object-contain w-full h-full"
          />
        </div>

        <div className="flex flex-col">
          <div className="text-sm font-semibold text-gray-900">
            Player Photo
          </div>
          <div className="text-[11px] text-gray-500 leading-tight">
            Upload a headshot or action shot. This will generate a shareable URL.
          </div>
          {uploading && (
            <div className="text-[11px] text-red-600 font-semibold mt-1">
              Uploading...
            </div>
          )}
        </div>
      </div>

      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
        <button
          type="button"
          onClick={triggerFileDialog}
          className="px-3 py-2 rounded-lg bg-red-800 text-white text-sm font-semibold hover:bg-red-900 active:scale-95 transition"
        >
          {uploading ? "Uploading..." : "Upload / Change Photo"}
        </button>
      </div>

      <div className="text-[11px] text-gray-500 text-center md:text-left">
        The card above will update after upload.
      </div>
    </div>
  );
}
