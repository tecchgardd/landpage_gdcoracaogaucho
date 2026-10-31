import { publicApiGet } from './apiClient';
import { mapEventFromApi, unwrapList } from './mappers';
import type { ApiListResponse, PublicEvent, PublicEventApi } from './types';

export const ticketService = {
  async listAvailableEvents(): Promise<PublicEvent[]> {
    return unwrapList(await publicApiGet<ApiListResponse<PublicEventApi>>('/api/public/events?upcoming=false&limit=100')).map(mapEventFromApi).filter((event) => !event.soldOut);
  },
  async getEvent(id: string | number): Promise<PublicEvent> {
    return mapEventFromApi(await publicApiGet<PublicEventApi>(`/api/public/events/${encodeURIComponent(String(id))}`));
  }
};
