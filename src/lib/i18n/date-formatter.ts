export class DateFormatter {
  static format(date: Date | string, locale: string = 'pt-BR'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(d);
  }
}
