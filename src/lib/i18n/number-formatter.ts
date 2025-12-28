export const formatNumber = (value: number, locale: string = 'pt-BR') => {
  return new Intl.NumberFormat(locale).format(value);
};

export const formatPercent = (value: number, locale: string = 'pt-BR') => {
  return new Intl.NumberFormat(locale, { style: 'percent' }).format(value);
};
