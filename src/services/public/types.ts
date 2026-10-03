export type ApiListResponse<T> = T[] | { data?: T[]; items?: T[]; results?: T[] };

export type PublicAlbumApi = Record<string, unknown>;
export type PublicEventApi = Record<string, unknown>;
export type PublicClassApi = Record<string, unknown>;
export type PublicAlbumImageApi = Record<string, unknown>;

export type PublicAlbum = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  city?: string;
  date?: string;
  coverImage?: string;
  cloudinaryFolder?: string;
  photoCount?: number;
  status?: string;
  displayOrder?: number;
};

export type PublicAlbumImage = {
  id: string;
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  width?: number;
  height?: number;
};

export type PublicAlbumDetail = PublicAlbum & {
  images: PublicAlbumImage[];
};

export type PublicEvent = {
  id: string;
  title: string;
  slug?: string;
  type?: string;
  description?: string;
  image?: string;
  date?: string;
  time?: string;
  place?: string;
  city?: string;
  startingPrice?: number;
  status?: string;
  detailHref?: string;
  ticketAvailable?: boolean;
  available?: number | null;
  soldOut?: boolean;
  free?: boolean;
  capacity?: number | null;
  salesEndAt?: string;
};

export type Buyer = { name: string; cpf: string; email: string; phone: string };
export type CheckoutRequest = { eventId: number; quantity: number; buyer: Buyer };
export type CheckoutResponse = { orderCode: string; status: string; free: boolean; total: number; checkoutUrl: string | null };
export type PublicOrder = { code: string; status: string; paymentStatus?: string; total: number };
export type AlbumPhotoPage = { data: PublicAlbumImage[]; nextCursor: string | null; total: number };

export type PublicClass = {
  id: string;
  title: string;
  slug?: string;
  city?: string;
  place?: string;
  startsAt?: string;
  weekday?: string;
  time?: string;
  lessons?: number;
  signupFee?: number;
  capacity?: number;
  occupied?: number;
  availableSpots?: number;
  image?: string;
  status?: string;
  signupHref?: string;
};

export type PublicEmpresa = { id: string; nome: string; imagemUrl: string };
