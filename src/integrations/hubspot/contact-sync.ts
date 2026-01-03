export interface HubSpotContact {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  lifecycleStage?: 'subscriber' | 'lead' | 'opportunity' | 'customer';
}

export interface SyncResult {
  success: boolean;
  contactId?: string;
  error?: string;
}

export const syncContactToHubSpot = async (contact: HubSpotContact): Promise<SyncResult> => {
  try {
    const response = await fetch('/api/hubspot/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact)
    });

    if (!response.ok) {
      throw new Error(`HubSpot sync failed: ${response.statusText}`);
    }

    const result = await response.json();
    return { success: true, contactId: result.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
