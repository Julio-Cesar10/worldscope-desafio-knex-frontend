/**
 * Tipos alinhados ao formato de resposta da REST Countries API v5.
 * A v5 aninha os campos em objetos (names.common, codes.alpha_3, flag.emoji, etc.),
 * diferente do formato "achatado" das versões anteriores (v3.1).
 */

export interface CountryNames {
  common: string;
  official: string;
  alternates?: string[];
  native?: Record<string, { common: string; official: string }>;
  translations?: Record<string, { common: string; official: string }>;
}

export interface CountryCodes {
  alpha_2: string;
  alpha_3: string;
  ccn3?: string;
  fips?: string;
  gec?: string;
  cioc?: string;
  fifa?: string;
}

export interface CountryFlag {
  emoji?: string;
  unicode?: string;
  html_entity?: string;
  url_png?: string;
  url_svg?: string;
  description?: string;
}

export interface CapitalAttributes {
  primary?: boolean;
  constitutional?: boolean;
  administrative?: boolean;
  executive?: boolean;
  legislative?: boolean;
  judicial?: boolean;
}

export interface Capital {
  name: string;
  coordinates?: { lat: number; lng: number };
  attributes?: CapitalAttributes;
}

export interface Language {
  bcp47: string;
  name: string;
  native_name?: string;
  iso639_1?: string;
  iso639_2?: string;
}

export interface Currency {
  name: string;
  symbol?: string;
}

export interface CountryArea {
  kilometers?: number;
  miles?: number;
}

export interface CountryCoordinates {
  lat?: number;
  lng?: number;
}

export interface CountryCars {
  driving_side?: 'left' | 'right';
  signs?: string[];
}

/**
 * Campos de resumo usados na listagem (cards). Buscados com response_fields
 * para manter o payload leve, já que a listagem carrega ~250 países de uma vez.
 */
export interface CountrySummary {
  names: Pick<CountryNames, 'common' | 'official' | 'translations'>;
  codes: Pick<CountryCodes, 'alpha_2' | 'alpha_3'>;
  flag: Pick<CountryFlag, 'emoji' | 'url_png' | 'url_svg'>;
  region: string;
  subregion?: string;
  population: number;
  currencies?: Record<string, Currency>;
}

/**
 * Registro completo de um país, usado na página de detalhes.
 */
export interface CountryDetail extends CountrySummary {
  capitals?: Capital[];
  area?: CountryArea;
  coordinates?: CountryCoordinates;
  timezones?: string[];
  languages?: Language[];
  borders?: string[];
  calling_codes?: string[];
  tlds?: string[];
  cars?: CountryCars;
  landlocked?: boolean;
  continents?: string[];
}

export type Region = 'Africa' | 'Americas' | 'Asia' | 'Europe' | 'Oceania';

export const REGIONS: Region[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

export type SortField = 'name' | 'population';
export type SortDirection = 'asc' | 'desc';
