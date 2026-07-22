import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="app-header">
      <Link to="/" className="app-header__brand">
        <span className="app-header__logo" aria-hidden="true">
          🌍
        </span>
        <div>
          <strong>{t('app.title')}</strong>
          <span className="app-header__tagline">{t('app.tagline')}</span>
        </div>
      </Link>
      <div className="app-header__controls">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}
