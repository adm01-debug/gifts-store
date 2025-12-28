export class RuleEngine {
  static evaluate(rule: any, data: any): boolean {
    switch (rule.operator) {
      case 'equals':
        return data[rule.field] === rule.value;
      case 'greater_than':
        return data[rule.field] > rule.value;
      default:
        return false;
    }
  }
}
