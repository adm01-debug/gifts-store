export interface ZapierBundle {
  inputData: Record<string, unknown>;
  authData: Record<string, string>;
}

export interface ZapierContext {
  request: (options: RequestInit & { url: string }) => Promise<Response>;
}

export interface ClientData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

export const zapierActions = {
  createClient: {
    key: 'create_client',
    noun: 'Client',
    display: { label: 'Create Client', description: 'Creates a new client in the system' },
    operation: {
      perform: async (_z: ZapierContext, bundle: ZapierBundle): Promise<ClientData> => {
        const { name, email, phone, company } = bundle.inputData as ClientData;
        return { name, email, phone, company };
      },
      inputFields: [
        { key: 'name', label: 'Name', required: true },
        { key: 'email', label: 'Email', required: true },
        { key: 'phone', label: 'Phone' },
        { key: 'company', label: 'Company' }
      ]
    }
  }
};
