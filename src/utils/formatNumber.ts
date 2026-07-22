export function formatNumber(value: number, language: string): string {
  const locale = language === 'pt' ? 'pt-BR' : 'en-US';
  return new Intl.NumberFormat(locale).format(value);
}

export function formatArea(kilometers: number | undefined, language: string): string {
  if (kilometers === undefined) return '—';
  return `${formatNumber(Math.round(kilometers), language)} km²`;
}
