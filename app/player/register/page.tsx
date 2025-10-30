"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const positions = [
  "Goalkeeper",
  "Right Back",
  "Center Back",
  "Left Back",
  "Defensive Midfielder",
  "Central Midfielder",
  "Attacking Midfielder",
  "Right Midfielder / Winger",
  "Left Midfielder / Winger",
  "Second Striker",
  "Striker",
];

export default function RegisterPlayerPage() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [number, setNumber] = useState<number | "">("");
  const [likes, setLikes] = useState("");
  const [bio, setBio] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await fetch("/api/player/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, number, positions: selectedPositions, likes, bio }),
    });
    if (res.ok) {
      setSubmitted(true);
      setTimeout(() => router.push("/"), 600);
    } else {
      alert("Failed to register player");
    }
  }

  function togglePosition(pos: string) {
    setSelectedPositions((prev) =>
      prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos]
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Register Player</h1>
          <Link href="/" className="text-sm text-red-800 hover:underline font-medium">
            ← Back to Roster
          </Link>
        </div>

        {submitted ? (
          <div className="rounded-lg bg-green-50 text-green-800 border border-green-200 p-4 text-sm">
            Thanks! Your registration was received.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Name</span>
                <input className="rounded border px-3 py-2" value={name} onChange={e=>setName(e.target.value)} required />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Number</span>
                <input type="number" className="rounded border px-3 py-2" min={0} value={number} onChange={e=>setNumber(e.target.value === '' ? '' : Number(e.target.value))} />
              </label>

              {/* Positions as radial (checkbox) buttons */}
              <div className="flex flex-col gap-2 sm:col-span-2">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Positions (choose multiple)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {positions.map((p) => {
                    const checked = selectedPositions.includes(p);
                    return (
                      <label key={p} className="flex items-center gap-2 rounded border px-3 py-2 cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={checked}
                          onChange={() => togglePosition(p)}
                        />
                        <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full border ${checked ? 'bg-red-800 border-red-800' : 'border-gray-400'}`}> 
                          {checked && <span className="w-2 h-2 bg-white rounded-full" />}
                        </span>
                        <span className="text-sm text-gray-800">{p}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <label className="flex flex-col gap-1 sm:col-span-2">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Likes (comma separated)</span>
                <input className="rounded border px-3 py-2" placeholder="Pizza, Messi, FIFA" value={likes} onChange={e=>setLikes(e.target.value)} />
              </label>
            </div>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Bio</span>
              <textarea className="rounded border px-3 py-2" rows={3} value={bio} onChange={e=>setBio(e.target.value)} />
            </label>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button type="submit" className="rounded-lg bg-red-800 text-white text-sm font-semibold px-3 py-2 hover:bg-red-900 transition">
                Submit Registration
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
