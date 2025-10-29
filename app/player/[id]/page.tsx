// Use Node runtime so Redis works server-side
export const runtime = "nodejs";

import { getPlayerById, Player } from "@/data/players";
import PlayerClientView from "./PlayerClientView";
import type { PersistedTotals } from "@/lib/playerTotals";
import { getPersistedTotals } from "@/lib/playerTotals";

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

  // Prefer persisted totals; fall back to computed from the seed stats
  const saved = await getPersistedTotals(id);
  const fallbackGoals = base.stats.reduce((s, g) => s + g.goals, 0);
  const fallbackAssists = base.stats.reduce((s, g) => s + g.assists, 0);

  const totalsFromServer: PersistedTotals = {
    goals: saved?.goals ?? fallbackGoals,
    assists: saved?.assists ?? fallbackAssists,
  };

  // pass base player (including photo that you already persist) and the totals override
  return (
    <PlayerClientView
      playerFromServer={base as Player}
      totalsFromServer={totalsFromServer}
    />
  );
}
