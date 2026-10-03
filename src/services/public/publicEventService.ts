import { publicApiGet } from './apiClient';
import { mapEventFromApi, unwrapList } from './mappers';
import { ApiListResponse, PublicEvent, PublicEventApi } from './types';

export const publicEventService = {
  async list(): Promise<PublicEvent[]> {
    const response = await publicApiGet<ApiListResponse<PublicEventApi>>('/api/public/events?upcoming=false&limit=100');
    return unwrapList(response).map(mapEventFromApi).filter((event) => event.type !== 'CURSO');
  },

  async getBySlug(slug: string): Promise<PublicEvent> {
    const response = await publicApiGet<PublicEventApi>(`/api/public/events/${encodeURIComponent(slug)}`);
    return mapEventFromApi(response);
  }
};
