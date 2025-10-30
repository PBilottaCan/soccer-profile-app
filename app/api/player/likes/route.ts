import { NextResponse } from "next/server";
import { setLikes } from "@/lib/playerMeta";

export async function POST(request: Request) {
  try {
    const { playerId, likes } = await request.json();
    if (!playerId) return NextResponse.json({ error: "playerId required" }, { status: 400 });
    await setLikes(String(playerId), Array.isArray(likes) ? likes.map((s:string)=>String(s)) : []);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("likes save failed", e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
