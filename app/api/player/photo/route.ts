import { NextResponse } from "next/server";
import { createClient } from "redis";
import { revalidatePath } from "next/cache";

async function getRedisClient() {
  const url = process.env.REDIS_URL;
  if (!url) throw new Error("REDIS_URL not set in environment variables");
  const client = createClient({ url });
  client.on("error", (err) => console.error("Redis Client Error", err));
  await client.connect();
  return client;
}

// POST /api/player/photo  { playerId, photoUrl }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { playerId, photoUrl } = body || {};

    if (!playerId || !photoUrl) {
      return NextResponse.json(
        { error: "playerId and photoUrl required" },
        { status: 400 }
      );
    }

    const client = await getRedisClient();
    await client.set(`player:${playerId}:photoUrl`, photoUrl);
    await client.quit();
    revalidatePath("/");
    revalidatePath(`/player/${playerId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Redis Save Error:", error);
    return NextResponse.json(
      { error: "Failed to save photo" },
      { status: 500 }
    );
  }
}

// GET /api/player/photo?playerId=lucah
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get("playerId");
    if (!playerId) {
      return NextResponse.json({ error: "playerId required" }, { status: 400 });
    }
    const client = await getRedisClient();
    const photoUrl = await client.get(`player:${playerId}:photoUrl`);
    await client.quit();
    return NextResponse.json({ photoUrl });
  } catch (error) {
    console.error("Redis Fetch Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch photo" },
      { status: 500 }
    );
  }
}
