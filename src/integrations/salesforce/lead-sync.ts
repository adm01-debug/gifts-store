export const syncLeadToSalesforce = async (lead: any) => {
  await fetch('/api/salesforce/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead)
  });
};
