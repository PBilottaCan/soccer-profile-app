import { createClient } from "redis";

export type PersistedTotals = { goals: number; assists: number };

const redisKeyFor = (playerId: string) => `player:${playerId}:totals`;

async function getRedisClient() {
  const url = process.env.REDIS_URL;
  if (!url) {
    return null;
  }
  const client = createClient({ url });
  client.on("error", (e) => console.error("Redis error:", e));
  await client.connect();
  return client;
}

export async function getPersistedTotals(
  playerId: string
): Promise<PersistedTotals | null> {
  const client = await getRedisClient();
  if (!client) {
    return null;
  }
  try {
    const raw = await client.get(redisKeyFor(playerId));
    return raw ? (JSON.parse(raw) as PersistedTotals) : null;
  } catch (e) {
    console.error("Failed to read totals", e);
    return null;
  } finally {
    await client.quit();
  }
}

export async function getPersistedTotalsMap(playerIds: string[]) {
  if (playerIds.length === 0) {
    return {} as Record<string, PersistedTotals>;
  }
  const client = await getRedisClient();
  if (!client) {
    return {} as Record<string, PersistedTotals>;
  }
  try {
    const keys = playerIds.map((id) => redisKeyFor(id));
    const values = await client.mGet(keys);
    const map: Record<string, PersistedTotals> = {};
    values.forEach((raw, idx) => {
      if (!raw) return;
      try {
        map[playerIds[idx]] = JSON.parse(raw) as PersistedTotals;
      } catch (e) {
        console.error("Failed to parse totals", e);
      }
    });
    return map;
  } catch (e) {
    console.error("Failed to read totals map", e);
    return {} as Record<string, PersistedTotals>;
  } finally {
    await client.quit();
  }
}
