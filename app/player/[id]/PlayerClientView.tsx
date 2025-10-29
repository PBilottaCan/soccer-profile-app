"use client";

import { useState } from "react";
import Link from "next/link";
import PlayerProfileCard from "@/components/PlayerProfileCard";
import PhotoUploader from "@/components/PhotoUploader";
import StatAdjuster from "@/components/StatAdjuster";
import StatTable from "@/components/StatTable";
import { Player } from "@/data/players";

type Totals = { goals: number; assists: number };

export default function PlayerClientView({
  playerFromServer,
  totalsFromServer,
}: {
  playerFromServer: Player;
  totalsFromServer: Totals;
}) {
  // photoUrl already persists in your app – keep your existing logic.
  const [photoUrl, setPhotoUrl] = useState(playerFromServer.photoUrl);
  const [goals, setGoals] = useState<number>(totalsFromServer.goals);
  const [assists, setAssists] = useState<number>(totalsFromServer.assists);
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [savingTotals, setSavingTotals] = useState(false);

  async function persistTotals(next: Totals) {
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

  async function handleTotalsChange(next: Totals) {
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

        <PlayerProfileCard player={{ ...playerFromServer, photoUrl }} />

        <PhotoUploader initialPhotoUrl={photoUrl} onChange={handlePhotoChange} />

        {(savingPhoto || savingTotals) && (
          <div className="text-[11px] text-red-600 font-semibold">
            {savingPhoto ? "Saving photo..." : "Saving stats..."}
          </div>
        )}

        <StatAdjuster
          goals={goals}
          assists={assists}
          onChange={(g, a) => handleTotalsChange({ goals: g, assists: a })}
        />

        <StatTable stats={playerFromServer.stats} />
      </div>
    </main>
  );
}
