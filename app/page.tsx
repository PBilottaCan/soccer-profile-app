export const runtime = "nodejs";

import PlayerCard from "@/components/PlayerCard";
import { players } from "@/data/players";
import { getPersistedTotalsMap } from "@/lib/playerTotals";

export default async function HomePage() {
  const totalsMap = await getPersistedTotalsMap(players.map((p) => p.id));

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          Team Roster
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {players.map((p) => (
            <PlayerCard
              key={p.id}
              player={p}
              totalsOverride={totalsMap[p.id]}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
