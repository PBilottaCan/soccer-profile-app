import { NextResponse } from "next/server";

// FAKE UPLOAD MODE: Always return a placeholder image for local development
export async function POST(request: Request) {
  // Simulate some async (fake) delay
  await new Promise(r => setTimeout(r, 250));
  return NextResponse.json({ url: "/player-placeholder.png" });
}
