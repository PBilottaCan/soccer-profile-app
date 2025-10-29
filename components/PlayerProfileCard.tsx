import Image from "next/image";
import { Player, getPlayerTotals } from "@/data/players";

export default function PlayerProfileCard({ player }: { player: Player }) {
  const totals = getPlayerTotals(player);

  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-6 md:flex-row">
      {/* Photo + basic info */}
      <div className="flex flex-col items-center text-center md:w-1/3">
        <div className="w-32 h-32 rounded-xl overflow-hidden border border-gray-200 shadow">
          <Image
            src={player.photoUrl}
            alt={player.name}
            width={128}
            height={128}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="mt-4">
          <div className="text-xl font-bold">
            #{player.number} {player.name}
          </div>
          <div className="text-sm inline-block bg-gray-100 text-gray-700 rounded-full px-2 py-1 font-medium mt-1">
            {player.position}
          </div>
        </div>
      </div>

      {/* Bio + likes + totals */}
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <div className="text-sm text-gray-500 font-semibold uppercase tracking-wide">
            Bio
          </div>
          <div className="text-base text-gray-800">{player.bio}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500 font-semibold uppercase tracking-wide">
            Likes
          </div>
          <ul className="text-base text-gray-800 list-disc list-inside">
            {player.likes.map((like, i) => (
              <li key={i}>{like}</li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 flex justify-around text-center">
          <div>
            <div className="text-xs text-gray-500 font-medium uppercase">
              Goals
            </div>
            <div className="text-xl font-bold">{totals.goals}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium uppercase">
              Assists
            </div>
            <div className="text-xl font-bold">{totals.assists}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium uppercase">
              Games
            </div>
            <div className="text-xl font-bold">{totals.gamesPlayed}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
