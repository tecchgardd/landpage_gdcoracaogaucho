import { publicApiGet } from './apiClient';
import type { PublicEmpresa } from './types';
export const publicCompanyService = { async list() { const response = await publicApiGet<{ data: PublicEmpresa[] }>('/api/public/empresas'); return response.data ?? []; } };
