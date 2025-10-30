export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import PlayerCard from "@/components/PlayerCard";
import { players as defaultPlayers } from "@/data/players";
import { getPersistedTotalsMap } from "@/lib/playerTotals";
import { getPersistedPhotoMap } from "@/lib/playerPhotos";
import { getPersistedPlayers } from "@/lib/playerRegistry";

export default async function HomePage() {
  const persisted = await getPersistedPlayers();
  const allPlayers = [...defaultPlayers, ...persisted];
  const playerIds = allPlayers.map((p) => p.id);
  const [totalsMap, photoMap] = await Promise.all([
    getPersistedTotalsMap(playerIds),
    getPersistedPhotoMap(playerIds),
  ]);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Roster</h1>
          <a
            href="/player/register"
            className="inline-block rounded-lg bg-red-800 text-white text-sm font-semibold px-3 py-2 hover:bg-red-900 transition"
          >
            Register Player
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {allPlayers.map((p) => (
            <PlayerCard
              key={p.id}
              player={p}
              totalsOverride={totalsMap[p.id]}
              photoOverride={photoMap[p.id]}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
