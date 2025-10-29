import { GameStat } from "@/data/players";

export default function StatTable({ stats }: { stats: GameStat[] }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
      <div className="text-sm text-gray-500 font-semibold uppercase tracking-wide mb-4">
        Game Log
      </div>
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b text-gray-700">
            <th className="py-2 pr-4 font-semibold">Date</th>
            <th className="py-2 pr-4 font-semibold">Opponent</th>
            <th className="py-2 pr-4 font-semibold">Goals</th>
            <th className="py-2 pr-4 font-semibold">Assists</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((game, idx) => (
            <tr key={idx} className="border-b last:border-b-0">
              <td className="py-2 pr-4">{game.date}</td>
              <td className="py-2 pr-4">{game.opponent}</td>
              <td className="py-2 pr-4 font-semibold">{game.goals}</td>
              <td className="py-2 pr-4 font-semibold">{game.assists}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
