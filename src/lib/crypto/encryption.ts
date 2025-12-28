import CryptoJS from 'crypto-js';

export class EncryptionService {
  private static SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-development-key-change-me';

  /**
   * Criptografa uma string
   */
  static encrypt(data: string): string {
    try {
      return CryptoJS.AES.encrypt(data, this.SECRET_KEY).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Descriptografa uma string
   */
  static decrypt(ciphertext: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, this.SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decrypted) {
        throw new Error('Decryption resulted in empty string');
      }
      
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Criptografa um objeto
   */
  static encryptObject<T>(obj: T): string {
    try {
      const json = JSON.stringify(obj);
      return this.encrypt(json);
    } catch (error) {
      console.error('Object encryption error:', error);
      throw new Error('Failed to encrypt object');
    }
  }

  /**
   * Descriptografa para objeto
   */
  static decryptObject<T>(ciphertext: string): T {
    try {
      const decrypted = this.decrypt(ciphertext);
      return JSON.parse(decrypted) as T;
    } catch (error) {
      console.error('Object decryption error:', error);
      throw new Error('Failed to decrypt object');
    }
  }

  /**
   * Gera hash SHA256
   */
  static hash(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }

  /**
   * Gera hash MD5 (para checksums, não segurança)
   */
  static md5(data: string): string {
    return CryptoJS.MD5(data).toString();
  }

  /**
   * Criptografa dados sensíveis do localStorage
   */
  static encryptLocalStorage(key: string, data: any): void {
    try {
      const encrypted = this.encryptObject(data);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('LocalStorage encryption error:', error);
    }
  }

  /**
   * Descriptografa dados do localStorage
   */
  static decryptLocalStorage<T>(key: string): T | null {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      
      return this.decryptObject<T>(encrypted);
    } catch (error) {
      console.error('LocalStorage decryption error:', error);
      return null;
    }
  }

  /**
   * Gera token aleatório
   */
  static generateToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Compara hashes de forma segura (timing-safe)
   */
  static compareHashes(hash1: string, hash2: string): boolean {
    if (hash1.length !== hash2.length) return false;
    
    let mismatch = 0;
    for (let i = 0; i < hash1.length; i++) {
      mismatch |= hash1.charCodeAt(i) ^ hash2.charCodeAt(i);
    }
    
    return mismatch === 0;
  }
}
