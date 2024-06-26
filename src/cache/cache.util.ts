/**
 * CacheUtil
 */
export class CacheUtil {
  /**
   * Get the key for a user
   * @param uid
   */
  static getUserCacheKey(uid: bigint) {
    return `user:${uid}`;
  }
}
