import * as OTPAuth from 'otpauth';

export class TwoFactorAuthService {
  generateSecret(email: string) {
    const totp = new OTPAuth.TOTP({
      issuer: 'Gifts Store',
      label: email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
    });
    return totp.secret.base32;
  }

  verifyToken(secret: string, token: string): boolean {
    const totp = new OTPAuth.TOTP({ secret: OTPAuth.Secret.fromBase32(secret) });
    return totp.validate({ token }) !== null;
  }
}

export const twoFactorAuth = new TwoFactorAuthService();
