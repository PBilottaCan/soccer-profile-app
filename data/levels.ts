// Levels are inspired by RED Academy's development culture:
// READY | EDUCATE | DEVELOP (player pathway, leadership, professionalism). :contentReference[oaicite:1]{index=1}

export const levels = [
  { level: 1,  name: "READY Rookie",           tagline: "Ready to learn.",                    points: 0 },
  { level: 2,  name: "Training Mindset",       tagline: "Shows up, puts work in.",            points: 50 },
  { level: 3,  name: "Educated Player",        tagline: "Understands the game.",              points: 120 },
  { level: 4,  name: "Playmaker",              tagline: "Creates for the team.",              points: 200 },
  { level: 5,  name: "Finisher",               tagline: "Hurts opponents in the final third.",points: 300 },
  { level: 6,  name: "Defensive Anchor",       tagline: "Protects the badge.",                points: 450 },
  { level: 7,  name: "Team Leader",            tagline: "Leads on and off the field.",        points: 650 },
  { level: 8,  name: "Academy Standout",       tagline: "Sets the standard.",                 points: 900 },
  { level: 9,  name: "Pathway Player",         tagline: "College / Pro pathway mindset.",     points: 1200 },
  { level: 10, name: "RED Icon",               tagline: "Developed player, developed person.",points: 1600 },
];

// Given a total point score, return the highest level the player qualifies for.
export function getLevelForPoints(points: number) {
  let current = levels[0];
  for (const lvl of levels) {
    if (points >= lvl.points) {
      current = lvl;
    } else {
      break;
    }
  }
  return current;
}
