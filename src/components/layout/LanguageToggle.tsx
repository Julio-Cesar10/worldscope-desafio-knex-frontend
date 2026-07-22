import { useTranslation } from 'react-i18next';

const LANGUAGES = ['en', 'pt'] as const;

export function LanguageToggle() {
  const { i18n, t } = useTranslation();

  return (
    <div className="segmented-control" role="group" aria-label="Language">
      {LANGUAGES.map((lng) => (
        <button
          key={lng}
          type="button"
          className={`segmented-control__option ${i18n.language === lng ? 'is-active' : ''}`}
          onClick={() => i18n.changeLanguage(lng)}
          aria-pressed={i18n.language === lng}
        >
          {lng === 'en' ? '🇺🇸' : '🇧🇷'} {t(`language.${lng}`)}
        </button>
      ))}
    </div>
  );
}
