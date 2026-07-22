import { useTranslation } from 'react-i18next';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  const { t } = useTranslation();

  return (
    <div className="state-container state-container--error" role="alert">
      <span className="state-icon" aria-hidden="true">
        ⚠️
      </span>
      <h2>{t('state.errorTitle')}</h2>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn--primary" onClick={onRetry}>
          {t('state.retry')}
        </button>
      )}
    </div>
  );
}
