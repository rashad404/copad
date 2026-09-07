/** Claims azdoc issues in its access tokens. */
export interface JwtPayload {
  sub?: string;
  email?: string;
  name?: string;
  roles?: string[];
  authorities?: string[];
  iat?: number;
  exp?: number;
  [claim: string]: unknown;
}
