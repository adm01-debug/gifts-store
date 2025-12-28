export const zapierActions = {
  createClient: {
    key: 'create_client',
    noun: 'Client',
    display: { label: 'Create Client' },
    operation: { perform: async (z: any, bundle: any) => ({}) }
  }
};
