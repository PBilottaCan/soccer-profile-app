import React from "react";

const badgeThemes = [
  // Bronze (1-3)
  {
    grad: "url(#bronze)",
    stroke: "#B87333",
    accent: "#991b1b",
    pattern: "#ecd6c0" // very light bronze pattern
  },
  {
    grad: "url(#bronze)",
    stroke: "#B87333",
    accent: "#991b1b",
    pattern: "#ecd6c0"
  },
  {
    grad: "url(#bronze)",
    stroke: "#B87333",
    accent: "#991b1b",
    pattern: "#ecd6c0"
  },
  // Silver (4-6)
  {
    grad: "url(#silver)",
    stroke: "#bbb",
    accent: "#111",
    pattern: "#f4f4f7"
  },
  {
    grad: "url(#silver)",
    stroke: "#bbb",
    accent: "#111",
    pattern: "#f4f4f7"
  },
  {
    grad: "url(#silver)",
    stroke: "#bbb",
    accent: "#111",
    pattern: "#f4f4f7"
  },
  // Gold (7-10)
  {
    grad: "url(#gold)",
    stroke: "#c28822",
    accent: "#000",
    pattern: "#ffe57f"
  },
  {
    grad: "url(#gold)",
    stroke: "#c28822",
    accent: "#000",
    pattern: "#ffe57f"
  },
  {
    grad: "url(#gold)",
    stroke: "#c28822",
    accent: "#000",
    pattern: "#ffe57f"
  },
  {
    grad: "url(#gold)",
    stroke: "#c28822",
    accent: "#000",
    pattern: "#ffe57f"
  },
];

export default function MilestoneBadge({ name, level, achieved }: { name: string; level: number; achieved: boolean }) {
  const theme = badgeThemes[(level-1)%badgeThemes.length];
  // Medal stars for top (gold), hex for silver, circle for bronze
  const overlay = level > 6
    ? (<polygon points="32,8 36,28 56,28 40,40 44,60 32,49 20,60 24,40 8,28 28,28" fill="#fffdee" opacity="0.7" stroke={theme.accent} strokeWidth="1.2" />)
    : level > 3
    ? (<polygon points="32,13 42,38 22,38" fill="#a3a3a3" opacity="0.25"/>)
    : (<circle cx="32" cy="28" r="9" fill="#e59e5a" opacity="0.18" />);

  return (
    <div className="relative flex flex-col items-center w-16 h-20 p-0.5" style={{ minWidth: 64 }}>
      {/* Checkmark for achieved badge */}
      {achieved && (
        <svg className="absolute w-5 h-5 top-0 right-0 z-10" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="8" fill="#4ade80"/>
          <path d="M5 8.2l2 2 4-4" stroke="#18181b" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      <svg viewBox="0 0 64 80" width="64" height="80" fill="none" className="drop-shadow mb-1">
        <defs>
          <linearGradient id="bronze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c39354" />
            <stop offset="100%" stopColor="#ecd6c0" />
          </linearGradient>
          <linearGradient id="silver" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e5e7eb" />
            <stop offset="100%" stopColor="#bbb" />
          </linearGradient>
          <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f9e373" />
            <stop offset="100%" stopColor="#c28822" />
          </linearGradient>
          {/* Pattern overlay */}
          <pattern id="dots" patternUnits="userSpaceOnUse" width="7" height="7">
            <circle cx="3.5" cy="3.5" r="1.5" fill={theme.pattern} opacity="0.4" />
          </pattern>
        </defs>
        {/* Main shield */}
        <path
          d="M4 8 C4 8,4 56,32 76 C60 56,60 8,60 8 Q32 2,4 8 Z"
          fill={theme.grad}
          stroke={theme.stroke}
          strokeWidth="2.4"
        />
        {/* Crisp angled highlight */}
        <path d="M6 13 Q32 18 58 13" stroke="#fff" strokeOpacity=".55" strokeWidth="1" fill="none" />
        {/* Pattern / dots */}
        <path
          d="M9 18 C11 44 32 67 55 18 Z"
          fill="url(#dots)"
          opacity=".6"
        />
        {overlay}
        {/* red/black side accent for medal type */}
        <ellipse
          cx="54" cy="28" rx="6" ry="12"
          fill={theme.accent}
          opacity="0.12"
        />
      </svg>
      <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-center w-[90%] whitespace-break-spaces leading-tight drop-shadow"
        style={{ color: '#1a1a1a', pointerEvents: "none", textShadow: "1px 1px 1px #0002" }}>
        {name}
      </span>
    </div>
  );
}
