import type { CountrySummary } from '@/types/country';
import { CountryCard } from './CountryCard';

interface CountryGridProps {
  countries: CountrySummary[];
}

export function CountryGrid({ countries }: CountryGridProps) {
  return (
    <div className="country-grid">
      {countries.map((country) => (
        <CountryCard key={country.codes.alpha_3} country={country} />
      ))}
    </div>
  );
}
