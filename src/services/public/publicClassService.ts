import { publicApiGet } from './apiClient';
import { mapClassFromApi, unwrapList } from './mappers';
import { ApiListResponse, PublicClass, PublicClassApi } from './types';

export const publicClassService = {
  async listAvailable(): Promise<PublicClass[]> {
    const response = await publicApiGet<ApiListResponse<PublicClassApi>>('/api/public/events?type=CURSO&upcoming=false&limit=100');
    return unwrapList(response).map(mapClassFromApi);
  },

  async getBySlug(slug: string): Promise<PublicClass> {
    const response = await publicApiGet<PublicClassApi>(`/api/public/events/${encodeURIComponent(slug)}`);
    return mapClassFromApi(response);
  }
};
