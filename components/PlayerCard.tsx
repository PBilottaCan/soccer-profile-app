import Image from "next/image";
import Link from "next/link";
import { Player, getPlayerTotals } from "@/data/players";

type Props = {
  player: Player;
};

export default function PlayerCard({ player }: Props) {
  const totals = getPlayerTotals(player);

  return (
    <Link
      href={`/player/${player.id}`}
      className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center hover:shadow-lg transition"
    >
      <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-200">
        <Image
          src={player.photoUrl}
          alt={player.name}
          width={96}
          height={96}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="mt-3">
        <div className="text-lg font-bold leading-tight">
          #{player.number} {player.name}
        </div>
        <div className="text-xs inline-block bg-gray-100 text-gray-700 rounded-full px-2 py-1 font-medium mt-1">
          {player.position}
        </div>
      </div>

      <div className="mt-4 flex gap-4 text-sm font-semibold">
        <div className="flex flex-col">
          <span className="text-gray-500 text-xs">G</span>
          <span>{totals.goals}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500 text-xs">A</span>
          <span>{totals.assists}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500 text-xs">GP</span>
          <span>{totals.gamesPlayed}</span>
        </div>
      </div>
    </Link>
  );
}
