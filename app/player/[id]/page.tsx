import PlayerProfileCard from "@/components/PlayerProfileCard";
import StatAdjuster from "@/components/StatAdjuster";
import StatTable from "@/components/StatTable";
import { getPlayerById, getPlayerTotals, players } from "@/data/players";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

// Make the component async so we can await params
export default async function PlayerPage({ params }: PageProps) {
  // unwrap the params Promise
  const { id } = await params;

  console.log("URL param id =", id);
  console.log("Known player IDs =", players.map((p) => p.id));

  const player = getPlayerById(id);

  if (!player) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-xl font-bold">Player not found</div>
          <div className="text-gray-600 text-sm mt-2">
            Double-check the URL.
          </div>
        </div>
      </main>
    );
  }

  const totals = getPlayerTotals(player);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <PlayerProfileCard player={player} />

        <StatAdjuster
          initialGoals={totals.goals}
          initialAssists={totals.assists}
        />

        <StatTable stats={player.stats} />
      </div>
    </main>
  );
}
