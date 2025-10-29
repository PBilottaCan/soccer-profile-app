import { createClient } from "redis";

const redisKeyForPhoto = (playerId: string) => `player:${playerId}:photoUrl`;

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

export async function getPersistedPhotoUrl(
  playerId: string
): Promise<string | null> {
  const client = await getRedisClient();
  if (!client) {
    return null;
  }
  try {
    const value = await client.get(redisKeyForPhoto(playerId));
    return value ?? null;
  } catch (e) {
    console.error("Failed to read photo URL", e);
    return null;
  } finally {
    await client.quit();
  }
}

export async function getPersistedPhotoMap(playerIds: string[]) {
  if (playerIds.length === 0) {
    return {} as Record<string, string>;
  }
  const client = await getRedisClient();
  if (!client) {
    return {} as Record<string, string>;
  }
  try {
    const keys = playerIds.map((id) => redisKeyForPhoto(id));
    const values = await client.mGet(keys);
    const map: Record<string, string> = {};
    values.forEach((value, idx) => {
      if (!value) return;
      map[playerIds[idx]] = value;
    });
    return map;
  } catch (e) {
    console.error("Failed to read photo map", e);
    return {} as Record<string, string>;
  } finally {
    await client.quit();
  }
}
