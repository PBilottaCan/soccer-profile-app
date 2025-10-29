// Force Node.js runtime so Redis works server-side
export const runtime = "nodejs";

import { getPlayerById, Player } from "@/data/players";
import PlayerClientView from "./PlayerClientView";
import { createClient } from "redis";

async function getSavedPhotoUrl(playerId: string): Promise<string | null> {
  const url = process.env.REDIS_URL;
  if (!url) return null;
  try {
    const client = createClient({ url });
    client.on("error", (err) => console.error("Redis Client Error", err));
    await client.connect();
    const val = await client.get(`player:${playerId}:photoUrl`);
    await client.quit();
    return val ?? null;
  } catch (e) {
    console.error("Redis read error:", e);
    return null;
  }
}

type PageProps = { params: Promise<{ id: string }> };

export default async function PlayerPage({ params }: PageProps) {
  const { id } = await params;

  const base = getPlayerById(id);
  if (!base) {
    return (
      <main className="min-h-screen bg-gray-100 p-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-bold">Player not found</h1>
          <p className="text-gray-600 text-sm mt-2">Double-check the URL.</p>
        </div>
      </main>
    );
  }

  const saved = await getSavedPhotoUrl(id);
  const effectivePlayer: Player = { ...base, photoUrl: saved ?? base.photoUrl };

  return <PlayerClientView playerFromServer={effectivePlayer} />;
}
