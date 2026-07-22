/**
 * Cache manual simples baseado em localStorage, com expiração (TTL).
 *
 * Trade-off consciente (ver README): a API de países muda raramente, então
 * uma dependência extra como React Query/SWR traria pouco ganho para o volume
 * de dados deste desafio. Um cache manual e explícito é mais fácil de explicar
 * e de depurar, ao custo de não ter invalidação automática por foco de janela,
 * refetch em background, ou deduplicação de requisições concorrentes "de fábrica".
 */

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
    // Armazenamento cheio ou indisponível (modo privado): falha silenciosamente,
    // a aplicação simplesmente vai direto para a rede na próxima leitura.
  }
}

export const CACHE_TTL = {
  countryList: 1000 * 60 * 60 * 12, // 12h — a listagem completa muda raramente
  countryDetail: 1000 * 60 * 60 * 24, // 24h — detalhes individuais mudam ainda menos
} as const;
