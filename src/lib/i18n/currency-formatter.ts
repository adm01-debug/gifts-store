export class CurrencyFormatter {
  static format(value: number, currency: string = 'BRL', locale: string = 'pt-BR'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(value);
  }
}
