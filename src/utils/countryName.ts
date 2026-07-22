import type { CountryNames } from '@/types/country';

/**
 * Retorna o nome comum do país no idioma ativo. Em português, usa
 * translations.por.common quando disponível (bônus de i18n do desafio);
 * caso contrário, cai de volta para o nome comum em inglês.
 */
export function getCountryDisplayName(names: CountryNames, language: string): string {
  if (language === 'pt') {
    return names.translations?.por?.common ?? names.common;
  }
  return names.common;
}
