'use server';

import { createClient } from 'redis';

let client: ReturnType<typeof createClient> | null = null;

async function getRedisClient() {
  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL || 'redis://redis:6379',
    });

    client.on('error', (err) => console.error('Redis Client Error', err));

    if (!client.isOpen) {
      await client.connect();
    }
  }
  return client;
}

export async function get(key: string): Promise<string | null> {
  try {
    const client = await getRedisClient();
    return await client.get(key);
  } catch (error) {
    console.error(`Error getting key ${key}:`, error);
    return null;
  }
}

export async function setex(
  key: string,
  seconds: number,
  value: string
): Promise<void> {
  try {
    const client = await getRedisClient();
    await client.setEx(key, seconds, value);
  } catch (error) {
    console.error(`Error setting key ${key}:`, error);
  }
}

export async function del(key: string): Promise<void> {
  try {
    const client = await getRedisClient();
    await client.del(key);
  } catch (error) {
    console.error(`Error deleting key ${key}:`, error);
  }
}

export async function exists(key: string): Promise<boolean> {
  try {
    const client = await getRedisClient();
    return (await client.exists(key)) === 1;
  } catch (error) {
    console.error(`Error checking key ${key}:`, error);
    return false;
  }
}
