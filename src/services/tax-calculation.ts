export function calculateTax(amount: number, state: string) {
  const icmsRates: Record<string, number> = {
    'SP': 0.18,
    'RJ': 0.20,
    'MG': 0.18
  };
  
  const rate = icmsRates[state] || 0.18;
  return {
    icms: amount * rate,
    total: amount * (1 + rate)
  };
}
