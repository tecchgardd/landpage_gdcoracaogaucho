import {
  ApiListResponse,
  PublicAlbum,
  PublicAlbumApi,
  PublicAlbumDetail,
  PublicAlbumImage,
  PublicAlbumImageApi,
  PublicClass,
  PublicClassApi,
  PublicEvent,
  PublicEventApi
} from './types';

export function unwrapList<T>(response: ApiListResponse<T>): T[] {
  if (Array.isArray(response)) return response;
  return response.data ?? response.items ?? response.results ?? [];
}

export function mapAlbumFromApi(item: PublicAlbumApi): PublicAlbum {
  return {
    id: stringValue(item.id),
    title: stringValue(item.title ?? item.titulo ?? item.name ?? item.nome, 'Álbum'),
    slug: stringValue(item.slug ?? item.id),
    description: optionalString(item.description ?? item.descricao),
    city: optionalString(item.city ?? item.cidade),
    date: optionalString(item.date ?? item.data ?? item.eventDate),
    coverImage: optionalString(item.coverImage ?? item.coverUrl ?? item.cover ?? item.image ?? item.imageUrl ?? item.secure_url),
    cloudinaryFolder: optionalString(item.cloudinaryFolder ?? item.folder ?? item.pastaCloudinary),
    photoCount: optionalNumber(item.photoCount ?? item.photosCount ?? item.quantidadeFotos ?? item._count),
    status: optionalString(item.status),
    displayOrder: optionalNumber(item.displayOrder ?? item.order ?? item.ordem)
  };
}

export function mapAlbumDetailFromApi(item: PublicAlbumApi): PublicAlbumDetail {
  const album = mapAlbumFromApi(item);
  const rawImages = Array.isArray(item.images) ? item.images : Array.isArray(item.photos) ? item.photos : Array.isArray(item.fotos) ? item.fotos : [];

  return {
    ...album,
    images: rawImages.map((image, index) => mapAlbumImageFromApi(asRecord(image), index))
  };
}

export function mapAlbumImageFromApi(item: PublicAlbumImageApi, index = 0): PublicAlbumImage {
  const url = stringValue(item.url ?? item.secure_url ?? item.secureUrl ?? item.imageUrl);

  return {
    id: stringValue(item.id ?? item.publicId ?? item.public_id ?? index),
    url,
    thumbnailUrl: optionalString(item.thumbnailUrl ?? item.thumbnail_url) ?? url,
    alt: optionalString(item.alt ?? item.title ?? item.caption),
    width: optionalNumber(item.width),
    height: optionalNumber(item.height)
  };
}

export function mapEventFromApi(item: PublicEventApi): PublicEvent {
  return {
    id: stringValue(item.id),
    title: stringValue(item.title ?? item.titulo ?? item.name ?? item.nome, 'Evento'),
    slug: optionalString(item.slug),
    type: optionalString(item.type ?? item.tipo ?? item.category ?? item.eventType),
    description: optionalString(item.description ?? item.descricao),
    image: optionalString(item.banner ?? item.bannerUrl ?? item.image ?? item.imageUrl ?? item.coverImage),
    date: optionalString(item.date ?? item.data ?? item.startsAt ?? item.startDate),
    time: optionalString(item.time ?? item.horario),
    place: optionalString(item.place ?? item.local ?? item.venue),
    city: optionalString(item.city ?? item.cidade),
    startingPrice: optionalNumber(item.startingPrice ?? item.price ?? item.valorInicial ?? item.valor),
    status: optionalString(item.status),
    detailHref: optionalString(item.detailHref ?? item.link ?? item.url),
    ticketAvailable: optionalBoolean(item.ticketAvailable ?? item.hasTickets ?? item.disponibilidadeIngresso),
    available: optionalNullableNumber(item.available ?? item.vagasDisponiveis),
    soldOut: optionalBoolean(item.soldOut ?? item.esgotado),
    free: optionalBoolean(item.free ?? item.gratuito),
    capacity: optionalNullableNumber(item.capacity ?? item.capacidade),
    salesEndAt: optionalString(item.salesEndAt ?? item.dataLimiteInscricao)
  };
}

export function mapClassFromApi(item: PublicClassApi): PublicClass {
  return {
    id: stringValue(item.id),
    title: stringValue(item.title ?? item.titulo ?? item.name ?? item.nome, 'Turma'),
    slug: optionalString(item.slug),
    city: optionalString(item.city ?? item.cidade),
    place: optionalString(item.place ?? item.local ?? item.venue),
    startsAt: optionalString(item.startsAt ?? item.startDate ?? item.dataInicio),
    weekday: optionalString(item.weekday ?? item.diaSemana),
    time: optionalString(item.time ?? item.horario),
    lessons: optionalNumber(item.lessons ?? item.aulas ?? item.quantidadeAulas),
    signupFee: optionalNumber(item.signupFee ?? item.taxaInscricao ?? item.price ?? item.preco),
    capacity: optionalNumber(item.capacity ?? item.capacidade),
    occupied: optionalNumber(item.occupied ?? item.vagasOcupadas),
    availableSpots: optionalNumber(item.availableSpots ?? item.vagasDisponiveis ?? item.available),
    image: optionalString(item.image ?? item.imageUrl ?? item.banner),
    status: optionalString(item.status),
    signupHref: optionalString(item.signupHref ?? item.registrationUrl ?? item.linkInscricao)
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

function stringValue(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return fallback;
}

function optionalString(value: unknown): string | undefined {
  const parsed = stringValue(value);
  return parsed || undefined;
}

function optionalNumber(value: unknown): number | undefined {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value.replace(',', '.'));
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  if (value && typeof value === 'object' && 'photos' in value) {
    const photos = (value as { photos?: unknown }).photos;
    return optionalNumber(photos);
  }

  return undefined;
}

function optionalNullableNumber(value: unknown): number | null | undefined {
  if (value === null) return null;
  return optionalNumber(value);
}

function optionalBoolean(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return ['true', '1', 'yes', 'sim'].includes(value.toLowerCase());
  return undefined;
}
