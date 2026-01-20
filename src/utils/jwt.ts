export const decodeJWT = (token: string): { [key: string]: unknown } | null => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url?.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    const parsedPayload: unknown = JSON.parse(jsonPayload);
    if (typeof parsedPayload === 'object' && parsedPayload !== null) {
      return parsedPayload as { [key: string]: unknown };
    }
    return null;
  } catch (e) {
    console.error('JWTデコードエラー:', e);
    return null;
  }
};

/**
 * トークンの有効期限が近いかチェックする（期限切れも含む）
 * @param token JWTトークン
 * @param thresholdMinutes 有効期限の閾値（分）デフォルトは5分
 * @returns 有効期限が閾値以内または既に切れている場合はtrue
 */
export function isTokenExpiringSoon(token: string, thresholdMinutes = 5): boolean {
  const jwt = decodeJWT(token);
  if (!jwt || !jwt.exp || typeof jwt.exp !== 'number') return true;

  const now = Math.floor(Date.now() / 1000);
  const timeUntilExpiry = jwt.exp - now;
  const thresholdSeconds = thresholdMinutes * 60;

  return timeUntilExpiry <= thresholdSeconds;
}
