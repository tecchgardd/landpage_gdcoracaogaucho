import { publicApiGet } from './apiClient';
import { ticketService } from './ticketService';
import { mapEventFromApi, unwrapList } from './mappers';
import { ApiListResponse, PublicEvent, PublicEventApi } from './types';

export const publicEventService = {
  async list(): Promise<PublicEvent[]> {
    // Mesma URL do ticketService: chamadas simultâneas são unificadas pelo apiClient e pelo cache do servidor.
    return unwrapList(await publicApiGet<ApiListResponse<PublicEventApi>>('/api/public/events?upcoming=false&limit=100')).map(mapEventFromApi).filter((event) => event.type !== 'CURSO');
  },

  async getBySlug(slug: string): Promise<PublicEvent> {
    return ticketService.getEvent(slug);
  }
};
