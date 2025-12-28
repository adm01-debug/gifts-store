export const zapierTriggers = {
  newQuote: {
    key: 'new_quote',
    noun: 'Quote',
    display: { label: 'New Quote Created' },
    operation: { perform: async () => [] }
  }
};
