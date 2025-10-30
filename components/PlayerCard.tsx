"use client";

import Link from "next/link";
import { Player, getPlayerTotals } from "@/data/players";
import { getLevelForPoints } from "@/data/levels";
import type { PersistedTotals } from "@/lib/playerTotals";
import PhotoUploader from "./PhotoUploader";
import { useState } from "react";

type Props = {
  player: Player;
  totalsOverride?: PersistedTotals;
  photoOverride?: string;
};

export default function PlayerCard({
  player,
  totalsOverride,
  photoOverride,
}: Props) {
  const [photoUrl, setPhotoUrl] = useState(photoOverride ?? player.photoUrl);

  async function handlePhotoChange(newUrl: string) {
    setPhotoUrl(newUrl);
    await fetch("/api/player/photo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId: player.id, photoUrl: newUrl }),
    });
  }

  const totals = getPlayerTotals(player);
  const levelInfo = getLevelForPoints(player.points);
  const goals = totalsOverride?.goals ?? totals.goals;
  const assists = totalsOverride?.assists ?? totals.assists;

  return (
    <Link
      href={`/player/${player.id}`}
      className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-0.5 transition border-4 border-blue-600"
    >
      {/* Player photo with overlayed upload button */}
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-blue-600 bg-white flex items-center justify-center">
        <PhotoUploader
          initialPhotoUrl={photoUrl}
          onChange={handlePhotoChange}
        />
      </div>

      {/* Basic identity */}
      <div className="mt-3">
        <div className="text-lg font-bold leading-tight text-gray-900">
          #{player.number} {player.name}
        </div>

        <div className="text-[11px] inline-block bg-blue-600 text-white rounded-full px-2 py-1 font-semibold uppercase tracking-wide mt-1">
          {player.position}
        </div>
      </div>

      {/* Level / points */}
      <div className="mt-3 flex flex-col items-center gap-1">
        <div className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2 py-1">
          {levelInfo.name}
        </div>
        <div className="text-[11px] text-gray-600 font-medium">
          {player.points} pts
        </div>
      </div>

      {/* Season summary stats */}
      <div className="mt-4 flex gap-4 text-sm font-semibold">
        <div className="flex flex-col">
          <span className="text-blue-600 text-base uppercase tracking-wide">
            G
          </span>
          <span>{goals}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-blue-600 text-base uppercase tracking-wide">
            A
          </span>
          <span>{assists}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-blue-600 text-base uppercase tracking-wide">
            GP
          </span>
          <span>{totals.gamesPlayed}</span>
        </div>
      </div>
    </Link>
  );
}
