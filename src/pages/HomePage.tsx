import { useTranslation } from 'react-i18next';
import { useCountries } from '@/hooks/useCountries';
import { useCountryFilters } from '@/hooks/useCountryFilters';
import { SearchBar } from '@/components/countries/SearchBar';
import { RegionFilter } from '@/components/countries/RegionFilter';
import { SortControl } from '@/components/countries/SortControl';
import { CountryGrid } from '@/components/countries/CountryGrid';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { EmptyState } from '@/components/common/EmptyState';

export function HomePage() {
  const { t, i18n } = useTranslation();
  const { countries, isLoading, error, refetch } = useCountries();
  const {
    searchTerm,
    setSearchTerm,
    region,
    setRegion,
    sortField,
    setSortField,
    sortDirection,
    toggleSortDirection,
    filteredCountries,
  } = useCountryFilters(countries, i18n.language);

  if (isLoading) return <LoadingSpinner label={t('state.loading')} />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="page">
      <div className="toolbar">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <div className="toolbar__filters">
          <RegionFilter value={region} onChange={setRegion} />
          <SortControl
            field={sortField}
            direction={sortDirection}
            onFieldChange={setSortField}
            onToggleDirection={toggleSortDirection}
          />
        </div>
      </div>

      {filteredCountries.length === 0 ? <EmptyState /> : <CountryGrid countries={filteredCountries} />}
    </div>
  );
}
