import { useTranslation } from 'react-i18next';
import type { SortDirection, SortField } from '@/types/country';

interface SortControlProps {
  field: SortField;
  direction: SortDirection;
  onFieldChange: (field: SortField) => void;
  onToggleDirection: () => void;
}

export function SortControl({ field, direction, onFieldChange, onToggleDirection }: SortControlProps) {
  const { t } = useTranslation();

  return (
    <div className="sort-control">
      <select
        className="select"
        value={field}
        onChange={(event) => onFieldChange(event.target.value as SortField)}
        aria-label={t('filters.sortBy')}
      >
        <option value="name">{t('filters.name')}</option>
        <option value="population">{t('filters.population')}</option>
      </select>
      <button
        type="button"
        className="btn btn--icon"
        onClick={onToggleDirection}
        title={direction === 'asc' ? t('filters.ascending') : t('filters.descending')}
        aria-label={direction === 'asc' ? t('filters.ascending') : t('filters.descending')}
      >
        {direction === 'asc' ? '↑' : '↓'}
      </button>
    </div>
  );
}
