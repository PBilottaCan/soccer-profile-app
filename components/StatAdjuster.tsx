"use client";

type Props = {
  goals: number;
  assists: number;
  playerOfGame?: number;
  onChange: (goals: number, assists: number) => void;
  onPlayerOfGameChange?: (count: number) => void;
};

export default function StatAdjuster({ goals, assists, playerOfGame, onChange, onPlayerOfGameChange }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        {/* Goals */}
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
            onClick={() => onChange(Math.max(0, goals - 1), assists)}
            aria-label="Decrease goals"
          >
            −
          </button>
          <div className="min-w-[3rem] text-center">
            <div className="text-xs text-gray-500">Goals</div>
            <div className="text-lg font-semibold">{goals}</div>
          </div>
          <button
            className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
            onClick={() => onChange(goals + 1, assists)}
            aria-label="Increase goals"
          >
            +
          </button>
        </div>
        {/* Assists */}
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
            onClick={() => onChange(goals, Math.max(0, assists - 1))}
            aria-label="Decrease assists"
          >
            −
          </button>
          <div className="min-w-[3rem] text-center">
            <div className="text-xs text-gray-500">Assists</div>
            <div className="text-lg font-semibold">{assists}</div>
          </div>
          <button
            className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
            onClick={() => onChange(goals, assists + 1)}
            aria-label="Increase assists"
          >
            +
          </button>
        </div>
        {/* Player of the Game */}
        {typeof playerOfGame === 'number' && onPlayerOfGameChange && (
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
              onClick={() => onPlayerOfGameChange(Math.max(0, playerOfGame - 1))}
              aria-label="Decrease player of the game"
            >
              −
            </button>
            <div className="min-w-[3rem] text-center">
              <div className="text-xs text-gray-500">Player of the Game</div>
              <div className="text-lg font-semibold">{playerOfGame}</div>
            </div>
            <button
              className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
              onClick={() => onPlayerOfGameChange(playerOfGame + 1)}
              aria-label="Increase player of the game"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
