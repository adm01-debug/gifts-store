export class BiometricAuth {
  static async authenticate(): Promise<boolean> {
    if ('credentials' in navigator) {
      try {
        const credential = await navigator.credentials.get({
          publicKey: {
            challenge: new Uint8Array(32),
            rpId: window.location.hostname,
            userVerification: 'required'
          }
        } as any);
        return !!credential;
      } catch {
        return false;
      }
    }
    return false;
  }
}
