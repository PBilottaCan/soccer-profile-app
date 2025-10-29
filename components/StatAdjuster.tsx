"use client";

import { useState } from "react";

type StatAdjusterProps = {
  initialGoals: number;
  initialAssists: number;
};

export default function StatAdjuster({
  initialGoals,
  initialAssists,
}: StatAdjusterProps) {
  const [goals, setGoals] = useState(initialGoals);
  const [assists, setAssists] = useState(initialAssists);

  const incGoals = () => setGoals((g) => g + 1);
  const decGoals = () => setGoals((g) => Math.max(0, g - 1));

  const incAssists = () => setAssists((a) => a + 1);
  const decAssists = () => setAssists((a) => Math.max(0, a - 1));

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-4">
      <div className="text-sm text-gray-500 font-semibold uppercase tracking-wide">
        Quick Update (Local Only)
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Goals block */}
        <div className="border rounded-lg p-4 flex flex-col items-center">
          <div className="text-xs text-gray-500 font-medium uppercase">Goals</div>
          <div className="text-2xl font-bold mb-2">{goals}</div>
          <div className="flex gap-2">
            <button
              onClick={decGoals}
              className="px-3 py-1 rounded bg-gray-200 text-gray-800 text-sm font-semibold active:scale-95"
            >
              −
            </button>
            <button
              onClick={incGoals}
              className="px-3 py-1 rounded bg-gray-800 text-white text-sm font-semibold active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        {/* Assists block */}
        <div className="border rounded-lg p-4 flex flex-col items-center">
          <div className="text-xs text-gray-500 font-medium uppercase">Assists</div>
          <div className="text-2xl font-bold mb-2">{assists}</div>
          <div className="flex gap-2">
            <button
              onClick={decAssists}
              className="px-3 py-1 rounded bg-gray-200 text-gray-800 text-sm font-semibold active:scale-95"
            >
              −
            </button>
            <button
              onClick={incAssists}
              className="px-3 py-1 rounded bg-gray-800 text-white text-sm font-semibold active:scale-95"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="text-[11px] text-gray-500 text-center">
        These changes are just on your screen right now. We’ll hook this up to save later.
      </div>
    </div>
  );
}
