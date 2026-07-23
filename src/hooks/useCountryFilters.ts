import { useMemo, useState } from 'react';
import { useDebounce } from './useDebounce';
import type { CountrySummary, Region, SortDirection, SortField } from '@/types/country';

interface UseCountryFiltersResult {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  region: Region | 'all';
  setRegion: (value: Region | 'all') => void;
  sortField: SortField;
  setSortField: (value: SortField) => void;
  sortDirection: SortDirection;
  toggleSortDirection: () => void;
  filteredCountries: CountrySummary[];
}

function getDisplayName(country: CountrySummary, language: string): string {
  if (language === 'pt') {
    return country.names.translations?.por?.common ?? country.names.common;
  }
  return country.names.common;
}


export function useCountryFilters(countries: CountrySummary[], language: string): UseCountryFiltersResult {
  const [searchTerm, setSearchTerm] = useState('');
  const [region, setRegion] = useState<Region | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const debouncedSearch = useDebounce(searchTerm, 200);

  const toggleSortDirection = () => setSortDirection((dir) => (dir === 'asc' ? 'desc' : 'asc'));

  const filteredCountries = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();

    let result = countries.filter((country) => {
      const matchesRegion = region === 'all' || country.region === region;
      if (!matchesRegion) return false;
      if (!term) return true;

      const nameMatch = getDisplayName(country, language).toLowerCase().includes(term);
      const officialMatch = country.names.official.toLowerCase().includes(term);
      return nameMatch || officialMatch;
    });

    result = [...result].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = getDisplayName(a, language).localeCompare(getDisplayName(b, language));
      } else {
        comparison = a.population - b.population;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [countries, debouncedSearch, region, sortField, sortDirection, language]);

  return {
    searchTerm,
    setSearchTerm,
    region,
    setRegion,
    sortField,
    setSortField,
    sortDirection,
    toggleSortDirection,
    filteredCountries,
  };
}
