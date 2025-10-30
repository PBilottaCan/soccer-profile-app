import { createClient } from "redis";

export type PlayerMeta = {
  bio?: string;
  likes?: string[];
  playerOfGame?: number;
};

const keyFor = (id: string) => `player:${id}:meta`;
let memory = new Map<string, PlayerMeta>();

async function getClient() {
  const url = process.env.REDIS_URL;
  if (!url) return null;
  const client = createClient({ url });
  client.on("error", (e) => console.error("Redis error:", e));
  await client.connect();
  return client;
}

export async function getMeta(id: string): Promise<PlayerMeta | null> {
  const client = await getClient();
  if (!client) return memory.get(id) ?? null;
  try {
    const raw = await client.get(keyFor(id));
    return raw ? (JSON.parse(raw) as PlayerMeta) : null;
  } finally {
    await client.quit();
  }
}

export async function getMetaMap(ids: string[]): Promise<Record<string, PlayerMeta>> {
  const client = await getClient();
  if (!client) {
    const out: Record<string, PlayerMeta> = {};
    ids.forEach((id) => { const m = memory.get(id); if (m) out[id] = m; });
    return out;
  }
  try {
    const keys = ids.map((id) => keyFor(id));
    const values = await client.mGet(keys);
    const out: Record<string, PlayerMeta> = {};
    values.forEach((raw, idx) => { if (raw) out[ids[idx]] = JSON.parse(raw) as PlayerMeta; });
    return out;
  } finally {
    await client.quit();
  }
}

async function writeMeta(id: string, update: PlayerMeta) {
  const client = await getClient();
  if (!client) {
    const prev = memory.get(id) ?? {};
    memory.set(id, { ...prev, ...update });
    return;
  }
  try {
    const raw = await client.get(keyFor(id));
    const prev = raw ? (JSON.parse(raw) as PlayerMeta) : {};
    const next = { ...prev, ...update } as PlayerMeta;
    await client.set(keyFor(id), JSON.stringify(next));
  } finally {
    await client.quit();
  }
}

export async function setBio(id: string, bio: string) { await writeMeta(id, { bio }); }
export async function setLikes(id: string, likes: string[]) { await writeMeta(id, { likes }); }
export async function setPlayerOfGame(id: string, playerOfGame: number) { await writeMeta(id, { playerOfGame }); }
