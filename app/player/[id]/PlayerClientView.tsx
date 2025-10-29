"use client";

import { useState } from "react";
import Link from "next/link";
import PlayerProfileCard from "@/components/PlayerProfileCard";
import PhotoUploader from "@/components/PhotoUploader";
import StatAdjuster from "@/components/StatAdjuster";
import StatTable from "@/components/StatTable";
import { Player, getPlayerTotals } from "@/data/players";

export default function PlayerClientView({
  playerFromServer,
}: {
  playerFromServer: Player;
}) {
  // Start with the player's current photoUrl
  // After upload, we'll get a permanent hosted URL and set it here.
  const [photoUrl, setPhotoUrl] = useState(playerFromServer.photoUrl);

  // We still compute totals with the base player's stats:
  const totals = getPlayerTotals({
    ...playerFromServer,
    photoUrl,
  });

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {/* Back nav */}
        <Link
          href="/"
          className="text-sm text-red-600 hover:underline font-medium"
        >
          ← Back to Team Roster
        </Link>

        {/* Profile card (uses updated photoUrl) */}
        <PlayerProfileCard
          player={{
            ...playerFromServer,
            photoUrl,
          }}
        />

        {/* Photo uploader (updates photoUrl, and tries to persist via Blob) */}
        <PhotoUploader
          initialPhotoUrl={photoUrl}
          onChange={(newUrl) => {
            setPhotoUrl(newUrl);
          }}
        />

        {/* Stat quick adjust (still local only for now) */}
        <StatAdjuster
          initialGoals={totals.goals}
          initialAssists={totals.assists}
        />

        {/* Per-game log */}
        <StatTable stats={playerFromServer.stats} />
      </div>
    </main>
  );
}
