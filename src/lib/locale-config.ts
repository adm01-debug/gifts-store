// Configuração de locale para pt-BR
export function setupLocale() {
  // Configurar locale do Intl para pt-BR
  if (typeof Intl !== 'undefined') {
    try {
      // Verificar se pt-BR é suportado
      new Intl.DateTimeFormat('pt-BR');
      new Intl.NumberFormat('pt-BR');
    } catch {
      console.warn('Locale pt-BR não totalmente suportado');
    }
  }
}
