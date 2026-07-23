import { apiGet } from './httpClient';
import { readCache, writeCache, CACHE_TTL } from '@/utils/localCache';
import type { CountryDetail, CountrySummary } from '@/types/country';

const LIST_RESPONSE_FIELDS = [
  'names.common',
  'names.official',
  'names.translations',
  'codes.alpha_2',
  'codes.alpha_3',
  'flag.emoji',
  'flag.url_png',
  'flag.url_svg',
  'region',
  'subregion',
  'population',
  'currencies',
].join(',');

const PAGE_SIZE = 100; 

const LIST_CACHE_KEY = 'countries-list-v1';
const detailCacheKey = (alpha3: string) => `country-detail-${alpha3.toLowerCase()}`;


export async function fetchAllCountries(forceRefresh = false): Promise<CountrySummary[]> {
  if (!forceRefresh) {
    const cached = readCache<CountrySummary[]>(LIST_CACHE_KEY);
    if (cached) return cached;
  }

  const all: CountrySummary[] = [];
  let offset = 0;
  
  for (let page = 0; page < 10; page += 1) {
    const batch = await apiGet<CountrySummary>('', {
      limit: PAGE_SIZE,
      offset,
      response_fields: LIST_RESPONSE_FIELDS,
    });
    all.push(...batch);
    if (batch.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  writeCache(LIST_CACHE_KEY, all, CACHE_TTL.countryList);
  return all;
}


export async function fetchCountryByCode(alpha3: string, forceRefresh = false): Promise<CountryDetail | null> {
  const cacheKey = detailCacheKey(alpha3);
  if (!forceRefresh) {
    const cached = readCache<CountryDetail>(cacheKey);
    if (cached) return cached;
  }

  const results = await apiGet<CountryDetail>(`/codes.alpha_3/${alpha3}`);
  const country = results[0] ?? null;
  if (country) {
    writeCache(cacheKey, country, CACHE_TTL.countryDetail);
  }
  return country;
}
