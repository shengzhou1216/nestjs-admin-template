export class RandUtil {
  /**
   * Generate a random password with at least one uppercase letter, one lowercase letter, and one number
   */
  static generatePassword(): string {
    const length = 8;
    const lowercaseCharset = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberCharset = '0123456789';
    const allCharset = lowercaseCharset + uppercaseCharset + numberCharset;

    let password = '';
    password += lowercaseCharset.charAt(
      Math.floor(Math.random() * lowercaseCharset.length),
    );
    password += uppercaseCharset.charAt(
      Math.floor(Math.random() * uppercaseCharset.length),
    );
    password += numberCharset.charAt(
      Math.floor(Math.random() * numberCharset.length),
    );

    for (let i = 3; i < length; i++) {
      password += allCharset.charAt(
        Math.floor(Math.random() * allCharset.length),
      );
    }

    return this.shuffle(password);
  }

  /**
   * Shuffle the characters in a string
   */
  private static shuffle(str: string): string {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  }
}
