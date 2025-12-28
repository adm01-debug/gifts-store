export const syncContactToHubSpot = async (contact: any) => {
  await fetch('/api/hubspot/contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contact)
  });
};
