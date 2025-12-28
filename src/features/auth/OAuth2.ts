export class OAuth2Provider {
  async authorize(provider: 'google' | 'github') {
    const redirectUrl = `${window.location.origin}/auth/callback`;
    const clientId = process.env[`VITE_${provider.toUpperCase()}_CLIENT_ID`];
    
    window.location.href = `https://${provider}.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}`;
  }

  async handleCallback(code: string) {
    // Exchange code for token
    return { accessToken: code };
  }
}

export const oauth2 = new OAuth2Provider();
