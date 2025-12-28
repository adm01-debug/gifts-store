export class TemplateEngine {
  parseTemplate(template: string, data: any): string {
    return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (match, key) => {
      return this.resolveVariable(key, data);
    });
  }

  resolveVariable(key: string, data: any): string {
    const parts = key.split('.');
    let value = data;
    for (const part of parts) {
      value = value?.[part];
    }
    return value?.toString() || '';
  }
}

export const templateEngine = new TemplateEngine();
