import type { PublicEvent } from '../public/types';

export type StoreKind = 'EVENT' | 'PRODUCT' | 'COURSE';
export type StoreCategory = 'ingressos' | 'cursos-presenciais' | 'cursos-online' | 'produtos';

export type ProductVariant = { id: string; label: string; available: number | null; price?: number };
export type Product = {
  id: string; slug: string; title: string; description?: string; category?: string;
  images: string[]; price: number; compareAtPrice?: number; variants: ProductVariant[];
  available: number | null; soldOut: boolean;
};

export type CourseLessonPreview = { id: string; title: string; durationMinutes?: number; preview?: boolean };
export type CourseModulePreview = { id: string; title: string; lessons: CourseLessonPreview[] };
export type OnlineCourse = {
  id: string; slug: string; title: string; subtitle?: string; description?: string; image?: string;
  trailerUrl?: string; level?: string; price: number; compareAtPrice?: number;
  lessonsCount: number; durationMinutes: number; accessDays: number | null; maxDevices: number;
  teachers: string[]; highlights: string[]; modules: CourseModulePreview[];
};

export type StoreItem = {
  key: string; kind: StoreKind; category: StoreCategory; refId: string; slug: string;
  title: string; subtitle?: string; image?: string; price: number; compareAtPrice?: number;
  date?: string; city?: string; place?: string; href: string; badge: string; soldOut: boolean;
  event?: PublicEvent; product?: Product; course?: OnlineCourse;
};

export const storeCategories: Array<{ id: StoreCategory | 'tudo'; label: string }> = [
  { id: 'tudo', label: 'Tudo' },
  { id: 'ingressos', label: 'Bailes e eventos' },
  { id: 'cursos-presenciais', label: 'Cursos presenciais' },
  { id: 'cursos-online', label: 'Cursos online' },
  { id: 'produtos', label: 'Produtos' }
];
