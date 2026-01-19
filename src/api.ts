import createClient from 'openapi-fetch';
import { type paths } from './api.types.gen';

export const client = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_URL,
});
