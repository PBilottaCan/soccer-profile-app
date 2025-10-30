import { NextResponse } from "next/server";
import { setPlayerOfGame } from "@/lib/playerMeta";

export async function POST(request: Request) {
  try {
    const { playerId, playerOfGame } = await request.json();
    if (!playerId) return NextResponse.json({ error: "playerId required" }, { status: 400 });
    await setPlayerOfGame(String(playerId), Number(playerOfGame || 0));
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("playerOfGame save failed", e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
