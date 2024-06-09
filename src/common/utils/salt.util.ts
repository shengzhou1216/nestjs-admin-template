import * as crypto from 'crypto';

/**
 * Salt utility class
 */
export class SaltUtil {
  /**
   * Generate a random salt
   * @param length Salt length (default 16)
   * @returns Salt
   */
  static generateSalt(length = 16): string {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }

  /**
   * Generate a hash from a password and a salt
   * @param password Password
   * @param salt Salt
   * @returns Hashed password
   */
  static hashPassword(password: string, salt: string): string {
    const hash = crypto.createHmac('sha256', salt);
    hash.update(password);
    return hash.digest('hex');
  }

  /**
   * Verify a password with a salt and a hash
   * @param password Password
   * @param salt Salt
   * @param hash Hashed password
   */
  static verifyPassword(password: string, salt: string, hash: string): boolean {
    return this.hashPassword(password, salt) === hash;
  }
}
