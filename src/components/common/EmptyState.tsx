import { useTranslation } from 'react-i18next';

export function EmptyState() {
  const { t } = useTranslation();

  return (
    <div className="state-container">
      <span className="state-icon" aria-hidden="true">
        🔎
      </span>
      <h2>{t('state.emptyTitle')}</h2>
      <p>{t('state.emptyBody')}</p>
    </div>
  );
}
