export type GameStat = {
  date: string;
  opponent: string;
  goals: number;
  assists: number;
};

export type Player = {
  id: string;
  name: string;
  number: number;
  position: string;
  bio: string;
  likes: string[];
  photoUrl: string;
  points: number;          // <-- NEW: total points earned
  stats: GameStat[];
  playerOfGame?: number;   // optional: number of Player of the Game awards
};

// ---- SAMPLE DATA ----
// You can tune `points` to match earned milestones.
export const players: Player[] = [
  {
    id: "lucah",
    name: "Lucah Bilotta",
    number: 10,
    position: "Midfield",
    bio: "High work rate box-to-box mid. Wins balls back, links play, sets the tone.",
    likes: ["Takis", "AC Milan", "Minecraft"],
    photoUrl: "/vercel.svg",
    points: 275, // e.g. regular games + assists + goals
    stats: [
      { date: "2025-10-10", opponent: "North York United", goals: 1, assists: 1 },
      { date: "2025-10-17", opponent: "Oshawa City", goals: 0, assists: 2 },
      { date: "2025-10-24", opponent: "Burlington SC", goals: 2, assists: 0 },
    ],
  },
  {
    id: "bennett",
    name: "Bennett Example",
    number: 7,
    position: "Forward",
    bio: "Clinical in front of goal. Loves running in behind. Always hunting chances.",
    likes: ["Messi", "Pizza", "FIFA"],
    photoUrl: "/vercel.svg",
    points: 360, // higher due to goals scored
    stats: [
      { date: "2025-10-10", opponent: "North York United", goals: 2, assists: 0 },
      { date: "2025-10-17", opponent: "Oshawa City", goals: 1, assists: 1 },
    ],
  },
  {
    id: "andrew",
    name: "Andrew Second",
    number: 12,
    position: "Defense",
    bio: "Reads danger early. Strong in duels. Calms the back line.",
    likes: ["Hockey", "Beach Days", "PS5"],
    photoUrl: "/vercel.svg",
    points: 510, // defensive anchor, leadership bonus
    stats: [
      { date: "2025-10-10", opponent: "North York United", goals: 0, assists: 0 },
      { date: "2025-10-17", opponent: "Oshawa City", goals: 0, assists: 1 },
    ],
  },
];

// Grab a player object by URL id (e.g. "lucah").
export function getPlayerById(id: string): Player | undefined {
  return players.find((p) => p.id === id);
}

// Totals for stat table and summary chips.
export function getPlayerTotals(player: Player) {
  const gamesPlayed = player.stats.length;
  const goals = player.stats.reduce((sum, g) => sum + g.goals, 0);
  const assists = player.stats.reduce((sum, g) => sum + g.assists, 0);
  return { gamesPlayed, goals, assists };
}
