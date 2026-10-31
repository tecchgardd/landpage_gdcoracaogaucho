import { publicApiGet } from './apiClient';
import { mapClassFromApi, unwrapList } from './mappers';
import { ApiListResponse, PublicClass, PublicClassApi } from './types';

export const publicClassService = {
  async listAvailable(): Promise<PublicClass[]> {
    return unwrapList(await publicApiGet<ApiListResponse<PublicClassApi>>('/api/public/events?type=CURSO&upcoming=false&limit=100')).map(mapClassFromApi);
  },

  async getBySlug(slug: string): Promise<PublicClass> {
    return mapClassFromApi(await publicApiGet<PublicClassApi>(`/api/public/events/${encodeURIComponent(slug)}`));
  }
};
