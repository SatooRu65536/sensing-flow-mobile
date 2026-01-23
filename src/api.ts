import createClient from 'openapi-fetch';
import { type components, type paths } from './api.types.gen';

export const client = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_URL,
});

export type CreateUserRequest = components['schemas']['CreateUserRequest'];
export type UploadSensorDataRequest = components['schemas']['UploadSensorDataRequest'];
