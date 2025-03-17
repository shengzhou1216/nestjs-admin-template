/**
 * System configuration
 */
export default interface SystemConfig {
  /**
   * System name
   */
  name: string;
  /**
   * System host
   */
  host: string;
  /**
   * System port
   */
  port: number;
  /**
   * Initial admin
   */
  initAdmin: {
    /**
     * Initial admin username
     */
    username: string;
    /**
     * Initial admin password
     */
    password: string;
  };
}
