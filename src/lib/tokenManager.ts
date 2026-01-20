import { Client, Stronghold } from '@tauri-apps/plugin-stronghold';
import { appDataDir } from '@tauri-apps/api/path';
import { type Tokens } from '@satooru65536/tauri-plugin-auth-cognito';

class TokenManager {
  private stronghold: Stronghold | null = null;
  private client: Client | null = null;
  private readonly clientName = 'auth_tokens_client';

  async init() {
    if (this.stronghold) return;

    const dataDir = await appDataDir();
    const vaultPath = `${dataDir}/tokens.hold`;
    const vaultPassword = 'secure_fixed_password_for_vault';

    this.stronghold = await Stronghold.load(vaultPath, vaultPassword);

    try {
      this.client = await this.stronghold.loadClient(this.clientName);
    } catch {
      this.client = await this.stronghold.createClient(this.clientName);
    }
  }

  async saveTokens(tokens: Tokens) {
    await this.init();
    if (!this.client || !this.stronghold) return;

    const store = this.client.getStore();
    const encoder = new TextEncoder();

    await store.insert('id_token', Array.from(encoder.encode(tokens.id_token)));
    await store.insert('access_token', Array.from(encoder.encode(tokens.access_token)));
    await store.insert('refresh_token', Array.from(encoder.encode(tokens.refresh_token)));

    await this.stronghold.save();
  }

  async getTokens(): Promise<Tokens | null> {
    await this.init();
    if (!this.client) return null;

    try {
      const idToken = await this.getToken('id_token');
      const accessToken = await this.getToken('access_token');
      const refreshToken = await this.getToken('refresh_token');

      if (idToken && accessToken) {
        return {
          id_token: idToken,
          access_token: accessToken,
          refresh_token: refreshToken || undefined,
        };
      }
      return null;
    } catch (e) {
      console.error('Error retrieving tokens', e);
      return null;
    }
  }

  async getToken(key: keyof Tokens): Promise<string | null> {
    await this.init();
    if (!this.client) return null;

    try {
      const store = this.client.getStore();
      const data = await store.get(key);
      if (data && data.length > 0) {
        return new TextDecoder().decode(new Uint8Array(data));
      }
      return null;
    } catch (e) {
      console.error(`${key} not found`, e);
      return null;
    }
  }

  async clearTokens() {
    await this.init();
    if (!this.client || !this.stronghold) return;

    const store = this.client.getStore();

    await store.remove('id_token');
    await store.remove('access_token');
    await store.remove('refresh_token');

    await this.stronghold.save();
  }
}

export const tokenManager = new TokenManager();
