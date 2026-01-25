import createClient from 'openapi-fetch';
import { type components, type paths } from './api.types.gen';
import { fetch } from '@tauri-apps/plugin-http';

export const client = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_URL,
  fetch: fetch,
});

export type CreateUserRequest = components['schemas']['CreateUserRequest'];
export type UploadSensorDataRequest = components['schemas']['UploadSensorDataRequest'];
