// Use Node runtime so Redis works server-side
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { getPlayerById, Player } from "@/data/players";
import PlayerClientView from "./PlayerClientView";
import type { PersistedTotals } from "@/lib/playerTotals";
import { getPersistedTotals } from "@/lib/playerTotals";
import { getPersistedPhotoUrl } from "@/lib/playerPhotos";
import { getPersistedPlayers } from "@/lib/playerRegistry";
import { getMeta } from "@/lib/playerMeta";

type PageProps = { params: Promise<{ id: string }> };

export default async function PlayerPage({ params }: PageProps) {
  const { id } = await params;
  const base = getPlayerById(id) || (await getPersistedPlayers()).find(p => p.id === id) || null;

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

  // Prefer persisted totals; fall back to computed from the seed stats
  const saved = await getPersistedTotals(id);
  const persistedPhoto = await getPersistedPhotoUrl(id);
  const meta = await getMeta(id);
  const fallbackGoals = base.stats.reduce((s, g) => s + g.goals, 0);
  const fallbackAssists = base.stats.reduce((s, g) => s + g.assists, 0);

  const totalsFromServer: PersistedTotals = {
    goals: saved?.goals ?? fallbackGoals,
    assists: saved?.assists ?? fallbackAssists,
  };

  const playerForClient: Player = {
    ...base,
    photoUrl: persistedPhoto ?? base.photoUrl,
    bio: meta?.bio ?? base.bio,
    likes: meta?.likes ?? base.likes,
    playerOfGame: meta?.playerOfGame ?? base.playerOfGame,
  };

  // pass base player with overrides and the totals override
  return (
    <PlayerClientView
      playerFromServer={playerForClient}
      totalsFromServer={totalsFromServer}
    />
  );
}
