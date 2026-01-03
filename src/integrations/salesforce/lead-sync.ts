export interface SalesforceLead {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  source?: string;
  status?: string;
}

export interface SyncResult {
  success: boolean;
  leadId?: string;
  error?: string;
}

export const syncLeadToSalesforce = async (lead: SalesforceLead): Promise<SyncResult> => {
  try {
    const response = await fetch('/api/salesforce/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead)
    });

    if (!response.ok) {
      throw new Error(`Salesforce sync failed: ${response.statusText}`);
    }

    const result = await response.json();
    return { success: true, leadId: result.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
