import { NextResponse } from "next/server";
import { setBio } from "@/lib/playerMeta";

export async function POST(request: Request) {
  try {
    const { playerId, bio } = await request.json();
    if (!playerId) return NextResponse.json({ error: "playerId required" }, { status: 400 });
    await setBio(String(playerId), String(bio ?? ""));
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("bio save failed", e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
