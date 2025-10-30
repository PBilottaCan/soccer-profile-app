"use client";

import { useState } from "react";
import Link from "next/link";
import PlayerProfileCard from "@/components/PlayerProfileCard";
import PhotoUploader from "@/components/PhotoUploader";
import StatAdjuster from "@/components/StatAdjuster";
import StatTable from "@/components/StatTable";
import { Player } from "@/data/players";
import type { PersistedTotals } from "@/lib/playerTotals";
import { levels } from "@/data/levels";
import MilestoneBadge from "@/components/MilestoneBadge";

export default function PlayerClientView({
  playerFromServer,
  totalsFromServer,
}: {
  playerFromServer: Player;
  totalsFromServer: PersistedTotals;
}) {
  // photoUrl already persists in your app – keep your existing logic.
  const [photoUrl, setPhotoUrl] = useState(playerFromServer.photoUrl);
  const [goals, setGoals] = useState<number>(totalsFromServer.goals);
  const [assists, setAssists] = useState<number>(totalsFromServer.assists);
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [savingTotals, setSavingTotals] = useState(false);
  const [playerOfGame, setPlayerOfGame] = useState(playerFromServer.playerOfGame ?? 0);

  async function persistTotals(next: PersistedTotals) {
    try {
      setSavingTotals(true);
      await fetch("/api/player/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: playerFromServer.id,
          goals: next.goals,
          assists: next.assists,
        }),
      });
    } finally {
      setSavingTotals(false);
    }
  }

  async function handleTotalsChange(next: PersistedTotals) {
    setGoals(next.goals);
    setAssists(next.assists);
    await persistTotals(next);
  }

  async function handlePhotoChange(newUrl: string) {
    setPhotoUrl(newUrl);
    try {
      setSavingPhoto(true);
      await fetch("/api/player/photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: playerFromServer.id, photoUrl: newUrl }),
      });
    } finally {
      setSavingPhoto(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <Link href="/" className="text-sm text-red-600 hover:underline font-medium">
          ← Back to Team Roster
        </Link>

        <PlayerProfileCard
          player={{ ...playerFromServer, photoUrl }}
          totalsOverride={{ goals, assists }}
          onPhotoChange={handlePhotoChange}
        />

        {(savingPhoto || savingTotals) && (
          <div className="text-[11px] text-red-600 font-semibold">
            {savingPhoto ? "Saving photo..." : "Saving stats..."}
          </div>
        )}

        <StatAdjuster
          goals={goals}
          assists={assists}
          onChange={(g, a) => handleTotalsChange({ goals: g, assists: a })}
          playerOfGame={playerOfGame}
          onPlayerOfGameChange={setPlayerOfGame}
        />

        <StatTable stats={playerFromServer.stats} />
        <div className="bg-white rounded-xl shadow p-6 mt-6">
          <div className="text-sm text-gray-500 font-semibold font-bold uppercase tracking-wide mb-4">
            Milestones
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {levels.map(lvl => (
              <div
                key={lvl.level}
                className={`flex flex-col items-center transition-opacity rounded-lg py-2 px-1 h-full ${playerFromServer.points >= lvl.points ? "opacity-100" : "opacity-30"}`}
              >
                <MilestoneBadge name={lvl.name} level={lvl.level} achieved={playerFromServer.points >= lvl.points} />
                <div className="text-[11px] leading-tight text-center mt-1">{lvl.tagline}</div>
                <div className="mt-0.5 text-[10px] font-mono text-gray-500">{lvl.points} pts</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
