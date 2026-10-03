import { publicApiGet } from './apiClient';
import { mapAlbumDetailFromApi, mapAlbumFromApi, mapAlbumImageFromApi, unwrapList } from './mappers';
import { AlbumPhotoPage, ApiListResponse, PublicAlbum, PublicAlbumApi, PublicAlbumDetail } from './types';

export const publicAlbumService = {
  async list(): Promise<PublicAlbum[]> {
    const response = await publicApiGet<ApiListResponse<PublicAlbumApi>>('/api/public/albums');
    return unwrapList(response).map(mapAlbumFromApi);
  },

  async getBySlug(slug: string): Promise<PublicAlbumDetail> {
    const response = await publicApiGet<PublicAlbumApi>(`/api/public/albums/${encodeURIComponent(slug)}`);
    return mapAlbumDetailFromApi(response);
  },

  async getPhotos(slug: string, cursor?: string, limit = 40): Promise<AlbumPhotoPage> {
    const params = new URLSearchParams({ limit: String(limit) });
    if (cursor) params.set('cursor', cursor);
    const response = await publicApiGet<{ data: Record<string, unknown>[]; nextCursor?: string | null; total?: number }>(
      `/api/public/albums/${encodeURIComponent(slug)}/photos?${params}`
    );
    return {
      data: (response.data ?? []).map((item, index) => mapAlbumImageFromApi(item, index)),
      nextCursor: response.nextCursor ?? null,
      total: response.total ?? response.data?.length ?? 0
    };
  }
};
