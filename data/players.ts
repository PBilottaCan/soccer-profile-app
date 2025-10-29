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
  stats: GameStat[];
};

// ---- SAMPLE DATA ----
export const players: Player[] = [
  {
    id: "lucah",
    name: "Lucah Bilotta",
    number: 10,
    position: "Midfield",
    bio: "High work rate box-to-box mid. Plays smart, physical, and loves winning the ball back.",
    likes: ["Takis", "AC Milan", "Minecraft"],
    photoUrl: "/vercel.svg",
    stats: [
      { date: "2025-10-10", opponent: "North York United", goals: 1, assists: 1 },
      { date: "2025-10-17", opponent: "Oshawa City", goals: 0, assists: 2 },
      { date: "2025-10-24", opponent: "Burlington SC", goals: 2, assists: 0 }
    ]
  },
  {
    id: "bennett",
    name: "Bennett Example",
    number: 7,
    position: "Forward",
    bio: "Clinical finisher up top. Loves breakaways, hates playing defense.",
    likes: ["Messi", "Pizza", "FIFA"],
    photoUrl: "/vercel.svg",
    stats: [
      { date: "2025-10-10", opponent: "North York United", goals: 2, assists: 0 },
      { date: "2025-10-17", opponent: "Oshawa City", goals: 1, assists: 1 }
    ]
  },
  {
    id: "andrew",
    name: "Andrew Second",
    number: 12,
    position: "Defense",
    bio: "Strong takeout shots, calm under pressure, reliable in the back line.",
    likes: ["Hockey", "Beach Days", "PS5"],
    photoUrl: "/vercel.svg",
    stats: [
      { date: "2025-10-10", opponent: "North York United", goals: 0, assists: 0 },
      { date: "2025-10-17", opponent: "Oshawa City", goals: 0, assists: 1 }
    ]
  }
];

// ---- HELPER FUNCTIONS ----
export function getPlayerById(id: string): Player | undefined {
  return players.find((p) => p.id === id);
}

export function getPlayerTotals(player: Player) {
  const gamesPlayed = player.stats.length;
  const goals = player.stats.reduce((sum, g) => sum + g.goals, 0);
  const assists = player.stats.reduce((sum, g) => sum + g.assists, 0);

  return { gamesPlayed, goals, assists };
}
