import { useTranslation } from 'react-i18next';
import { REGIONS, type Region } from '@/types/country';

interface RegionFilterProps {
  value: Region | 'all';
  onChange: (value: Region | 'all') => void;
}

export function RegionFilter({ value, onChange }: RegionFilterProps) {
  const { t } = useTranslation();

  return (
    <select
      className="select"
      value={value}
      onChange={(event) => onChange(event.target.value as Region | 'all')}
      aria-label={t('filters.region')}
    >
      <option value="all">{t('filters.allRegions')}</option>
      {REGIONS.map((region) => (
        <option key={region} value={region}>
          {region}
        </option>
      ))}
    </select>
  );
}
