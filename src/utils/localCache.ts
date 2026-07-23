

interface CacheEnvelope<T> {
  storedAt: number;
  ttlMs: number;
  value: T;
}

const PREFIX = 'worldscope:cache:';

export function readCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;

    const envelope = JSON.parse(raw) as CacheEnvelope<T>;
    const isExpired = Date.now() - envelope.storedAt > envelope.ttlMs;
    if (isExpired) {
      localStorage.removeItem(PREFIX + key);
      return null;
    }
    return envelope.value;
  } catch {
    return null;
  }
}

export function writeCache<T>(key: string, value: T, ttlMs: number): void {
  try {
    const envelope: CacheEnvelope<T> = { storedAt: Date.now(), ttlMs, value };
    localStorage.setItem(PREFIX + key, JSON.stringify(envelope));
  } catch {
  }
}

export const CACHE_TTL = {
  countryList: 1000 * 60 * 60 * 12, 
  countryDetail: 1000 * 60 * 60 * 24, 
} as const;
