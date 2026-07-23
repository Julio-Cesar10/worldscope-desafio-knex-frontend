import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCountryDetail } from '@/hooks/useCountryDetail';
import { useCountries } from '@/hooks/useCountries';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { getCountryDisplayName } from '@/utils/countryName';
import { formatArea, formatNumber } from '@/utils/formatNumber';

export function CountryDetailPage() {
  const { code } = useParams<{ code: string }>();
  const { t, i18n } = useTranslation();
  const { country, isLoading, error, notFound } = useCountryDetail(code);
  
  const { countries } = useCountries();

  if (isLoading) return <LoadingSpinner label={t('state.loadingDetail')} />;
  if (error) return <ErrorMessage message={error} />;

  if (notFound || !country) {
    return (
      <div className="state-container">
        <span className="state-icon" aria-hidden="true">
          🗺️
        </span>
        <h2>{t('detail.notFoundTitle')}</h2>
        <p>{t('detail.notFoundBody')}</p>
        <Link to="/" className="btn btn--primary">
          {t('detail.back')}
        </Link>
      </div>
    );
  }

  const displayName = getCountryDisplayName(country.names, i18n.language);
  const capitalNames = country.capitals?.map((c) => c.name).join(', ') || '—';
  const currencyNames = country.currencies
    ? Object.values(country.currencies)
        .map((currency) => (currency.symbol ? `${currency.name} (${currency.symbol})` : currency.name))
        .join(', ')
    : '—';
  const languageNames = country.languages?.map((lang) => lang.name).join(', ') || '—';
  const timezoneList = country.timezones?.join(', ') || '—';

  const borderCountries = (country.borders ?? [])
    .map((code3) => countries.find((c) => c.codes.alpha_3 === code3))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <div className="page country-detail">
      <Link to="/" className="back-link">
        ← {t('detail.back')}
      </Link>

      <div className="country-detail__header">
        {country.flag.url_svg ? (
          <img src={country.flag.url_svg} alt={`${displayName} flag`} className="country-detail__flag" />
        ) : (
          <span className="country-detail__flag-emoji" aria-hidden="true">
            {country.flag.emoji}
          </span>
        )}
        <div>
          <h1>{displayName}</h1>
          <p className="country-detail__official-name">
            {t('detail.officialName')}: {country.names.official}
          </p>
        </div>
      </div>

      <div className="country-detail__grid">
        <DetailItem label={t('detail.capital')} value={capitalNames} />
        <DetailItem label={t('detail.region')} value={country.region} />
        <DetailItem label={t('detail.subregion')} value={country.subregion ?? '—'} />
        <DetailItem label={t('detail.population')} value={formatNumber(country.population, i18n.language)} />
        <DetailItem label={t('detail.area')} value={formatArea(country.area?.kilometers, i18n.language)} />
        <DetailItem label={t('detail.currencies')} value={currencyNames} />
        <DetailItem label={t('detail.languages')} value={languageNames} />
        <DetailItem label={t('detail.timezones')} value={timezoneList} />
        {country.cars?.driving_side && (
          <DetailItem label={t('detail.drivingSide')} value={country.cars.driving_side} />
        )}
      </div>

      <section className="country-detail__borders">
        <h2>{t('detail.borders')}</h2>
        {borderCountries.length === 0 ? (
          <p>{t('detail.noBorders')}</p>
        ) : (
          <div className="border-chip-list">
            {borderCountries.map((border) => (
              <Link key={border.codes.alpha_3} to={`/country/${border.codes.alpha_3}`} className="border-chip">
                {border.flag.emoji ?? '🏳️'} {getCountryDisplayName(border.names, i18n.language)}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-item">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
