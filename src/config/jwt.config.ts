/**
 * JWT configuration
 */
export default interface JwtConfig {
  secret: string;
  accessExpiresIn: number | string;
  refreshExpiresIn: number | string;
  resetPasswordExpiresIn: number | string;
  verifyEmailExpiresIn: number | string;
}
