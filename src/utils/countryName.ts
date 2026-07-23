import type { CountryNames } from '@/types/country';


export function getCountryDisplayName(names: CountryNames, language: string): string {
  if (language === 'pt') {
    return names.translations?.por?.common ?? names.common;
  }
  return names.common;
}
