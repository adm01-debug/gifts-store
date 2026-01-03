import CryptoJS from 'crypto-js';

export class HashingService {
  /**
   * Gera hash SHA-256
   */
  static sha256(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }

  /**
   * Gera hash SHA-512
   */
  static sha512(data: string): string {
    return CryptoJS.SHA512(data).toString();
  }

  /**
   * Gera hash SHA-1 (legado, não recomendado para senhas)
   */
  static sha1(data: string): string {
    return CryptoJS.SHA1(data).toString();
  }

  /**
   * Gera hash MD5 (apenas para checksums, não segurança)
   */
  static md5(data: string): string {
    return CryptoJS.MD5(data).toString();
  }

  /**
   * Gera hash HMAC SHA-256
   */
  static hmacSha256(data: string, secret: string): string {
    return CryptoJS.HmacSHA256(data, secret).toString();
  }

  /**
   * Gera hash HMAC SHA-512
   */
  static hmacSha512(data: string, secret: string): string {
    return CryptoJS.HmacSHA512(data, secret).toString();
  }

  /**
   * Gera hash de senha com salt
   */
  static hashPassword(password: string, salt?: string): { hash: string; salt: string } {
    const generatedSalt = salt || this.generateSalt();
    const hash = this.sha512(password + generatedSalt);
    
    return { hash, salt: generatedSalt };
  }

  /**
   * Verifica senha contra hash
   */
  static verifyPassword(password: string, hash: string, salt: string): boolean {
    const { hash: computedHash } = this.hashPassword(password, salt);
    return this.timingSafeCompare(computedHash, hash);
  }

  /**
   * Gera salt aleatório
   */
  static generateSalt(length: number = 16): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Compara strings de forma timing-safe
   */
  static timingSafeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    
    let mismatch = 0;
    for (let i = 0; i < a.length; i++) {
      mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    
    return mismatch === 0;
  }

  /**
   * Gera hash de arquivo
   */
  static async hashFile(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const wordArray = CryptoJS.lib.WordArray.create(buffer as any);
    return CryptoJS.SHA256(wordArray).toString();
  }

  /**
   * Gera checksum de dados
   */
  static checksum(data: string): string {
    return this.md5(data);
  }

  /**
   * Gera hash único baseado em timestamp
   */
  static generateUniqueHash(): string {
    const timestamp = Date.now().toString();
    const random = this.generateSalt(8);
    return this.sha256(timestamp + random);
  }

  /**
   * Gera hash de objeto (para comparação)
   */
  static hashObject(obj: Record<string, unknown>): string {
    const json = JSON.stringify(obj, Object.keys(obj).sort());
    return this.sha256(json);
  }

  /**
   * Bcrypt-like hash (simulado com PBKDF2)
   */
  static async pbkdf2(
    password: string,
    salt: string,
    iterations: number = 10000,
    keyLength: number = 64
  ): Promise<string> {
    const key = CryptoJS.PBKDF2(password, salt, {
      keySize: keyLength / 4,
      iterations: iterations
    });
    return key.toString();
  }
}

// Exporta funções comuns
export const {
  sha256,
  sha512,
  md5,
  hashPassword,
  verifyPassword,
  generateSalt,
  checksum
} = HashingService;
