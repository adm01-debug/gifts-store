export class TokenRefresh {
  static async refreshToken(refreshToken: string): Promise<string> {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    const data = await response.json();
    return data.accessToken;
  }
}
