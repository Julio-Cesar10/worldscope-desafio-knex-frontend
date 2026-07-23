import { useCallback, useEffect, useState } from 'react';
import { fetchAllCountries } from '@/services/countriesService';
import { RestCountriesError } from '@/types/api';
import type { CountrySummary } from '@/types/country';

interface UseCountriesResult {
  countries: CountrySummary[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}


export function useCountries(): UseCountriesResult {
  const [countries, setCountries] = useState<CountrySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const refetch = useCallback(() => setReloadToken((token) => token + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchAllCountries(reloadToken > 0);
        if (!cancelled) setCountries(data);
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof RestCountriesError ? err.friendlyMessage : 'Erro inesperado ao carregar países.';
          setError(message);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  return { countries, isLoading, error, refetch };
}
