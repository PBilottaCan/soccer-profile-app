import { NextResponse } from "next/server";
import type { Player } from "@/data/players";
import { addPlayer } from "@/lib/playerRegistry";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
    const number = Number(body.number ?? 0);
    const positions: string[] = Array.isArray(body.positions) ? body.positions : (body.position ? [String(body.position)] : []);
    const bio = String(body.bio || "").trim();
    const likesRaw: string = String(body.likes || "");
    const likes = likesRaw ? likesRaw.split(",").map((x)=>x.trim()).filter(Boolean) : [];
    const photoUrl = String(body.photoUrl || "/player-placeholder.png");

    const idBase = name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 16) || `p${Date.now()}`;
    const id = `${idBase}-${Date.now().toString().slice(-5)}`;

    const player: Player = {
      id,
      name,
      number: isNaN(number) ? 0 : number,
      position: positions.join(" / ") || "Unassigned",
      bio: bio || "",
      likes,
      photoUrl,
      points: 0,
      stats: [],
      playerOfGame: 0,
    };

    await addPlayer(player);
    return NextResponse.json({ player }, { status: 201 });
  } catch (e) {
    console.error("Register player failed", e);
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }
}
