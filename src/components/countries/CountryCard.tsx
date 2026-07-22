import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { CountrySummary } from '@/types/country';
import { getCountryDisplayName } from '@/utils/countryName';
import { formatNumber } from '@/utils/formatNumber';

interface CountryCardProps {
  country: CountrySummary;
}

function getMainCurrency(country: CountrySummary): string | null {
  if (!country.currencies) return null;
  const entries = Object.entries(country.currencies);
  if (entries.length === 0) return null;
  const [code, currency] = entries[0];
  return currency.symbol ? `${currency.name} (${currency.symbol})` : `${currency.name} (${code})`;
}

export function CountryCard({ country }: CountryCardProps) {
  const { t, i18n } = useTranslation();
  const displayName = getCountryDisplayName(country.names, i18n.language);
  const currency = getMainCurrency(country);

  return (
    <Link to={`/country/${country.codes.alpha_3}`} className="country-card">
      <div className="country-card__flag-wrap">
        {country.flag.url_svg ? (
          <img src={country.flag.url_svg} alt={`${displayName} flag`} className="country-card__flag" loading="lazy" />
        ) : (
          <span className="country-card__flag-emoji" aria-hidden="true">
            {country.flag.emoji}
          </span>
        )}
      </div>
      <div className="country-card__body">
        <h3 className="country-card__name">{displayName}</h3>
        <dl className="country-card__facts">
          <div>
            <dt>{t('card.region')}</dt>
            <dd>{country.region}</dd>
          </div>
          <div>
            <dt>{t('card.population')}</dt>
            <dd>{formatNumber(country.population, i18n.language)}</dd>
          </div>
          {currency && (
            <div>
              <dt>{t('card.currency')}</dt>
              <dd>{currency}</dd>
            </div>
          )}
        </dl>
      </div>
    </Link>
  );
}
