interface GetOpenAuthPayloadProps {
  codeChallenge: string;
  scope?: string[];
}

export function getOpenAuthPayload({ scope = ['openid'], codeChallenge }: GetOpenAuthPayloadProps) {
  const scheme = import.meta.env.VITE_SCHEME;
  if (scheme.includes('://')) throw new Error('VITE_SCHEME should not include "://".');

  const url = new URL('/oauth2/authorize', import.meta.env.VITE_AWS_LOGIN_DOMAIN);
  url.searchParams.append('client_id', import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID);
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('code_challenge_method', 'S256');
  url.searchParams.append('scope', scope.join('+'));
  url.searchParams.append('redirect_uri', import.meta.env.VITE_REDIRECT_URI);
  url.searchParams.append('code_challenge', codeChallenge);

  return { url: url.toString(), scheme };
}
