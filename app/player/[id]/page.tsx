import { getPlayerById, Player } from "@/data/players";
import PlayerClientView from "./PlayerClientView";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PlayerPage({ params }: PageProps) {
  const { id } = await params;
  const player = getPlayerById(id);

  if (!player) {
    return (
      <main className="min-h-screen bg-gray-100 p-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-bold">Player not found</h1>
          <p className="text-gray-600 text-sm mt-2">Double-check the URL.</p>
        </div>
      </main>
    );
  }

  // Pass plain data to client component
  return <PlayerClientView playerFromServer={player as Player} />;
}
