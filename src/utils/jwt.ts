export type JwtPayload = {
  sub?: string;
  id?: string;
  [key: string]: unknown;
};

export function parseJwt(token: string): JwtPayload {
  const base64 = token.split('.')[1];
  const json   = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
  // JSON.parse returnerar unknown, vi kastar till JwtPayload
  return JSON.parse(
    decodeURIComponent(
      json
        .split('')
        .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    )
  ) as JwtPayload;
}