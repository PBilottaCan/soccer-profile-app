// Force Node.js runtime (Redis needs Node, not Edge)
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "redis";
import type { PersistedTotals } from "@/lib/playerTotals";
import { revalidatePath } from "next/cache";

async function getRedis() {
  const url = process.env.REDIS_URL;
  if (!url) throw new Error("REDIS_URL is not set");
  const client = createClient({ url });
  client.on("error", (e) => console.error("Redis error:", e));
  await client.connect();
  return client;
}

const keyFor = (playerId: string) => `player:${playerId}:totals`;

// POST /api/player/stats   body: { playerId, goals, assists }
export async function POST(req: Request) {
  try {
    const { playerId, goals, assists } = await req.json();
    if (!playerId || typeof goals !== "number" || typeof assists !== "number") {
      return NextResponse.json(
        { error: "playerId, goals, assists required" },
        { status: 400 }
      );
    }
    const client = await getRedis();
    const value: PersistedTotals = { goals, assists };
    await client.set(keyFor(playerId), JSON.stringify(value));
    await client.quit();
    revalidatePath("/");
    revalidatePath(`/player/${playerId}`);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Save totals error:", e);
    return NextResponse.json({ error: "Failed to save totals" }, { status: 500 });
  }
}

// GET /api/player/stats?playerId=lucah
export async function GET(req: Request) {
  try {
    const playerId = new URL(req.url).searchParams.get("playerId");
    if (!playerId) {
      return NextResponse.json({ error: "playerId required" }, { status: 400 });
    }
    const client = await getRedis();
    const raw = await client.get(keyFor(playerId));
    await client.quit();
    const totals: PersistedTotals | null = raw ? JSON.parse(raw) : null;
    return NextResponse.json({ totals });
  } catch (e) {
    console.error("Read totals error:", e);
    return NextResponse.json({ error: "Failed to read totals" }, { status: 500 });
  }
}
