import { Player, getPlayerTotals } from "@/data/players";
import { getLevelForPoints } from "@/data/levels";

export default function PlayerProfileCard({ player }: { player: Player }) {
  const totals = getPlayerTotals(player);
  const levelInfo = getLevelForPoints(player.points);

  const isBlob = player.photoUrl.startsWith("blob:");

  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-6 md:flex-row">
      {/* Left column: photo + core badge */}
      <div className="flex flex-col items-center text-center md:w-1/3">
        <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-red-600 bg-white shadow flex items-center justify-center">
          {isBlob ? (
            // For uploaded blob URLs, use plain img
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={player.photoUrl}
              alt={player.name}
              className="object-contain w-full h-full"
            />
          ) : (
            // For static/public images, or deployed URLs, use next/image
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={player.photoUrl}
              alt={player.name}
              className="object-contain w-full h-full"
            />
          )}
        </div>

        <div className="mt-4">
          <div className="text-xl font-bold text-gray-900">
            #{player.number} {player.name}
          </div>

          <div className="text-xs inline-block bg-red-600 text-white rounded-full px-2 py-1 font-semibold uppercase tracking-wide mt-2">
            {player.position}
          </div>

          {/* Level and points */}
          <div className="mt-3 flex flex-col items-center gap-1">
            <div className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-full px-2 py-1 text-center leading-snug">
              {levelInfo.name}
            </div>
            <div className="text-[11px] text-gray-600 font-medium leading-tight text-center">
              {player.points} pts • {levelInfo.tagline}
            </div>
          </div>
        </div>
      </div>

      {/* Right column: bio, likes, totals */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Bio */}
        <div>
          <div className="text-sm text-gray-500 font-semibold uppercase tracking-wide">
            Player Profile
          </div>
          <div className="text-base text-gray-800">{player.bio}</div>
        </div>

        {/* Likes / personality */}
        <div>
          <div className="text-sm text-gray-500 font-semibold uppercase tracking-wide">
            Off the Field
          </div>
          <ul className="text-base text-gray-800 list-disc list-inside">
            {player.likes.map((like, i) => (
              <li key={i}>{like}</li>
            ))}
          </ul>
        </div>

        {/* Season totals */}
        <div className="bg-gray-50 rounded-lg p-4 flex justify-around text-center">
          <div>
            <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">
              Goals
            </div>
            <div className="text-xl font-bold text-gray-900">
              {totals.goals}
            </div>
          </div>

          <div>
            <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">
              Assists
            </div>
            <div className="text-xl font-bold text-gray-900">
              {totals.assists}
            </div>
          </div>

          <div>
            <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">
              Games
            </div>
            <div className="text-xl font-bold text-gray-900">
              {totals.gamesPlayed}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
