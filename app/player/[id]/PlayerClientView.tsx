"use client";

import { useState } from "react";
import Link from "next/link";
import PlayerProfileCard from "@/components/PlayerProfileCard";
import PhotoUploader from "@/components/PhotoUploader";
import StatAdjuster from "@/components/StatAdjuster";
import StatTable from "@/components/StatTable";
import { Player, getPlayerTotals } from "@/data/players";

export default function PlayerClientView({ playerFromServer }: { playerFromServer: Player }) {
  const [photoUrl, setPhotoUrl] = useState(playerFromServer.photoUrl);
  const [savingPhoto, setSavingPhoto] = useState(false);

  const totals = getPlayerTotals({ ...playerFromServer, photoUrl });

  async function handlePhotoChange(newUrl: string) {
    setPhotoUrl(newUrl); // instant UI
    try {
      setSavingPhoto(true);
      await fetch("/api/player/photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: playerFromServer.id, photoUrl: newUrl }),
      });
    } catch (e) {
      console.error("Failed to persist photo URL", e);
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
        {savingPhoto && <div className="text-[11px] text-red-600 font-semibold">Saving photo...</div>}

        <StatAdjuster initialGoals={totals.goals} initialAssists={totals.assists} />
        <StatTable stats={playerFromServer.stats} />
      </div>
    </main>
  );
}
