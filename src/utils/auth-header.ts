export function authHeader(token: string): { [key: string]: string } {
  return {
    Authorization: `Bearer ${token}`,
  };
}
