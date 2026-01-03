import DOMPurify from 'dompurify';

export class XSSProtection {
  /**
   * Escapa caracteres HTML especiais
   */
  static escapeHTML(str: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    };
    return str.replace(/[&<>"'/]/g, (char) => map[char]);
  }

  /**
   * Remove todos os scripts de uma string
   */
  static removeScripts(str: string): string {
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/on\w+\s*=\s*[^\s>]*/gi, '');
  }

  /**
   * Sanitiza atributos de um elemento HTML
   */
  static sanitizeAttributes(element: HTMLElement): HTMLElement {
    const dangerousAttrs = ['onclick', 'onerror', 'onload', 'onmouseover'];
    
    dangerousAttrs.forEach(attr => {
      if (element.hasAttribute(attr)) {
        element.removeAttribute(attr);
      }
    });

    // Remove event handlers inline
    Array.from(element.attributes).forEach(attr => {
      if (attr.name.startsWith('on')) {
        element.removeAttribute(attr.name);
      }
    });

    return element;
  }

  /**
   * Valida e sanitiza URL para prevenir XSS
   */
  static sanitizeURL(url: string): string {
    // Remove javascript: e data: URLs
    if (url.match(/^\s*(javascript|data):/i)) {
      return '';
    }

    // Permite apenas http, https e mailto
    if (!url.match(/^\s*(https?:|mailto:|\/)/i)) {
      return '';
    }

    return url;
  }

  /**
   * Sanitiza input para uso em JSON
   */
  static sanitizeJSON(value: unknown): unknown {
    if (typeof value === 'string') {
      return this.escapeHTML(value);
    }

    if (Array.isArray(value)) {
      return value.map(item => this.sanitizeJSON(item));
    }

    if (typeof value === 'object' && value !== null) {
      const sanitized: Record<string, unknown> = {};
      Object.keys(value as Record<string, unknown>).forEach(key => {
        sanitized[key] = this.sanitizeJSON((value as Record<string, unknown>)[key]);
      });
      return sanitized;
    }

    return value;
  }

  /**
   * Limpa completamente HTML mantendo apenas texto
   */
  static stripHTML(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  /**
   * Sanitiza entrada de formulário
   */
  static sanitizeFormInput(input: string, allowHTML: boolean = false): string {
    if (!allowHTML) {
      return this.escapeHTML(input.trim());
    }

    return DOMPurify.sanitize(input.trim(), {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
      ALLOWED_ATTR: []
    });
  }

  /**
   * Valida se string contém potencial XSS
   */
  static containsXSS(str: string): boolean {
    const xssPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
      /eval\(/i,
      /expression\(/i,
    ];

    return xssPatterns.some(pattern => pattern.test(str));
  }

  /**
   * Cria um sanitizador personalizado DOMPurify
   */
  static createSanitizer(config?: DOMPurify.Config) {
    return (dirty: string) => DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: ['href', 'target'],
      ALLOW_DATA_ATTR: false,
      ...config
    });
  }
}

// Exporta instância default
export const xssProtection = new XSSProtection();
