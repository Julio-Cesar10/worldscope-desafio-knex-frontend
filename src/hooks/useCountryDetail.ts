import { useEffect, useState } from 'react';
import { fetchCountryByCode } from '@/services/countriesService';
import { RestCountriesError } from '@/types/api';
import type { CountryDetail } from '@/types/country';

interface UseCountryDetailResult {
  country: CountryDetail | null;
  isLoading: boolean;
  error: string | null;
  notFound: boolean;
}

export function useCountryDetail(alpha3: string | undefined): UseCountryDetailResult {
  const [country, setCountry] = useState<CountryDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!alpha3) return;
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      setNotFound(false);
      try {
        const data = await fetchCountryByCode(alpha3 as string);
        if (cancelled) return;
        if (!data) {
          setNotFound(true);
        } else {
          setCountry(data);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof RestCountriesError ? err.friendlyMessage : 'Erro inesperado ao carregar o país.';
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
  }, [alpha3]);

  return { country, isLoading, error, notFound };
}
