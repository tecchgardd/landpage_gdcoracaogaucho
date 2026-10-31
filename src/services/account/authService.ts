import { publicApiGet, publicApiPost } from '../public/apiClient';

export type SessionUser = { id: string; name: string; email: string; role?: string; image?: string | null };
export type SessionResponse = { user: SessionUser | null; session?: unknown } | null;
export type CustomerSignUpInput = { name: string; email: string; cpf: string; phone: string; cep: string; address: string; password: string };
type SocialSignInResponse = { url?: string; redirect?: boolean };
export type SocialProvider = 'apple' | 'facebook' | 'google' | 'microsoft';
export const SOCIAL_PROVIDER_NAMES: Record<SocialProvider, string> = { apple: 'Apple', facebook: 'Facebook', google: 'Google', microsoft: 'Microsoft' };

export const authService = {
  getSession: () => publicApiGet<SessionResponse>('/api/auth/get-session'),
  signIn: (email: string, password: string) => publicApiPost<SessionResponse>('/api/auth/sign-in/email', { email, password }),
  signUp: (data: CustomerSignUpInput) => publicApiPost<SessionResponse>('/api/customer-auth/sign-up', data),
  signOut: () => publicApiPost<{ success?: boolean }>('/api/auth/sign-out', {}),
  signInSocial: async (provider: SocialProvider, callbackURL: string) => {
    const response = await publicApiPost<SocialSignInResponse>('/api/auth/sign-in/social', { provider, callbackURL });
    if (!response.url) throw new Error(`Login com ${SOCIAL_PROVIDER_NAMES[provider]} não está disponível.`);
    window.location.assign(response.url);
  }
};
