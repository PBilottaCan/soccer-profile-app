import { createClient } from "redis";
import type { Player } from "@/data/players";

const REGISTRY_KEY = "players:registered";
let memoryStore: Player[] = [];

async function getRedisClient() {
  const url = process.env.REDIS_URL;
  if (!url) return null;
  const client = createClient({ url });
  client.on("error", (e) => console.error("Redis error:", e));
  await client.connect();
  return client;
}

export async function getPersistedPlayers(): Promise<Player[]> {
  const client = await getRedisClient();
  if (!client) return memoryStore;
  try {
    const raw = await client.get(REGISTRY_KEY);
    return raw ? (JSON.parse(raw) as Player[]) : [];
  } catch (e) {
    console.error("Failed to read players registry", e);
    return [];
  } finally {
    await client.quit();
  }
}

export async function addPlayer(p: Player): Promise<void> {
  const client = await getRedisClient();
  if (!client) {
    memoryStore.push(p);
    return;
  }
  try {
    const raw = await client.get(REGISTRY_KEY);
    const list: Player[] = raw ? (JSON.parse(raw) as Player[]) : [];
    list.push(p);
    await client.set(REGISTRY_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Failed to write players registry", e);
  } finally {
    await client.quit();
  }
}
