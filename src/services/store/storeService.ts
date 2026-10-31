import { publicApiGet } from '../public/apiClient';
import { asRecord, optionalNullableNumber, optionalNumber, optionalString, stringValue, unwrapList } from '../public/mappers';
import type { ApiListResponse, PublicEvent } from '../public/types';
import { ticketService } from '../public/ticketService';
import type { CourseModulePreview, OnlineCourse, Product, StoreItem } from './types';

type Raw = Record<string, unknown>;
const list = (value: unknown) => (Array.isArray(value) ? value : []).map(asRecord);
const strings = (value: unknown) => (Array.isArray(value) ? value : []).map((item) => typeof item === 'string' ? item : stringValue(asRecord(item).url ?? asRecord(item).secure_url ?? asRecord(item).name ?? asRecord(item).nome)).filter(Boolean);

export function mapProductFromApi(item: Raw): Product {
  const variants = list(item.variants ?? item.variantes).map((variant) => ({ id: stringValue(variant.id), label: stringValue(variant.label ?? variant.name ?? variant.nome ?? variant.tamanho, 'Único'), available: optionalNullableNumber(variant.available ?? variant.estoque) ?? null, price: optionalNumber(variant.price ?? variant.preco) }));
  const available = optionalNullableNumber(item.available ?? item.estoque) ?? null;
  return {
    id: stringValue(item.id), slug: stringValue(item.slug ?? item.id), title: stringValue(item.title ?? item.name ?? item.nome, 'Produto'),
    description: optionalString(item.description ?? item.descricao), category: optionalString(item.category ?? item.categoria),
    images: strings(item.images ?? item.imagens).concat(optionalString(item.image ?? item.imagem) ?? []).filter((url, index, all) => all.indexOf(url) === index),
    price: optionalNumber(item.price ?? item.preco) ?? 0, compareAtPrice: optionalNumber(item.compareAtPrice ?? item.precoDe),
    variants, available, soldOut: Boolean(item.soldOut ?? item.esgotado) || available === 0
  };
}

export function mapCourseFromApi(item: Raw): OnlineCourse {
  const modules: CourseModulePreview[] = list(item.modules ?? item.modulos).map((module) => ({ id: stringValue(module.id), title: stringValue(module.title ?? module.titulo, 'Módulo'), lessons: list(module.lessons ?? module.aulas).map((lesson) => ({ id: stringValue(lesson.id), title: stringValue(lesson.title ?? lesson.titulo, 'Aula'), durationMinutes: optionalNumber(lesson.durationMinutes ?? lesson.duracaoMinutos), preview: Boolean(lesson.preview ?? lesson.gratuita) })) }));
  return {
    id: stringValue(item.id), slug: stringValue(item.slug ?? item.id), title: stringValue(item.title ?? item.titulo ?? item.nome, 'Curso online'),
    subtitle: optionalString(item.subtitle ?? item.subtitulo), description: optionalString(item.description ?? item.descricao),
    image: optionalString(item.image ?? item.imagem ?? item.banner ?? item.coverImage), trailerUrl: optionalString(item.trailerUrl ?? item.trailer),
    level: optionalString(item.level ?? item.nivel), price: optionalNumber(item.price ?? item.preco) ?? 0, compareAtPrice: optionalNumber(item.compareAtPrice ?? item.precoDe),
    lessonsCount: optionalNumber(item.lessonsCount ?? item.totalAulas) ?? modules.reduce((sum, module) => sum + module.lessons.length, 0),
    durationMinutes: optionalNumber(item.durationMinutes ?? item.duracaoMinutos) ?? 0,
    accessDays: optionalNullableNumber(item.accessDays ?? item.diasAcesso) ?? null, maxDevices: optionalNumber(item.maxDevices ?? item.limiteDispositivos) ?? 2,
    teachers: strings(item.teachers ?? item.professores), highlights: strings(item.highlights ?? item.destaques), modules
  };
}

const eventItem = (event: PublicEvent): StoreItem => {
  const course = event.type === 'CURSO';
  return { key: `EVENT:${event.id}`, kind: 'EVENT', category: course ? 'cursos-presenciais' : 'ingressos', refId: event.id, slug: event.slug ?? event.id, title: event.title, image: event.image, price: event.startingPrice ?? 0, date: event.date, city: event.city, place: event.place, href: `/loja/eventos/${encodeURIComponent(event.slug ?? event.id)}`, badge: course ? 'Turma presencial' : event.type === 'BAILE' ? 'Baile' : 'Evento', soldOut: Boolean(event.soldOut), event };
};
const productItem = (product: Product): StoreItem => ({ key: `PRODUCT:${product.id}`, kind: 'PRODUCT', category: 'produtos', refId: product.id, slug: product.slug, title: product.title, subtitle: product.category, image: product.images[0], price: product.price, compareAtPrice: product.compareAtPrice, href: `/loja/produtos/${encodeURIComponent(product.slug)}`, badge: product.category ?? 'Produto', soldOut: product.soldOut, product });
const courseItem = (course: OnlineCourse): StoreItem => ({ key: `COURSE:${course.id}`, kind: 'COURSE', category: 'cursos-online', refId: course.id, slug: course.slug, title: course.title, subtitle: course.subtitle, image: course.image, price: course.price, compareAtPrice: course.compareAtPrice, href: `/loja/cursos/${encodeURIComponent(course.slug)}`, badge: 'Curso online', soldOut: false, course });

export const storeService = {
  events: () => ticketService.listAvailableEvents(),
  products: async () => unwrapList(await publicApiGet<ApiListResponse<Raw>>('/api/public/products')).map(mapProductFromApi),
  product: async (slug: string) => mapProductFromApi(await publicApiGet<Raw>(`/api/public/products/${encodeURIComponent(slug)}`)),
  courses: async () => unwrapList(await publicApiGet<ApiListResponse<Raw>>('/api/public/courses')).map(mapCourseFromApi),
  course: async (slug: string) => mapCourseFromApi(await publicApiGet<Raw>(`/api/public/courses/${encodeURIComponent(slug)}`)),
  async catalog(): Promise<{ items: StoreItem[]; failed: string[] }> {
    const [events, products, courses] = await Promise.allSettled([storeService.events(), storeService.products(), storeService.courses()]);
    const failed = [events.status === 'rejected' && 'eventos', products.status === 'rejected' && 'produtos', courses.status === 'rejected' && 'cursos online'].filter(Boolean) as string[];
    return { failed, items: [...(events.status === 'fulfilled' ? events.value.map(eventItem) : []), ...(courses.status === 'fulfilled' ? courses.value.map(courseItem) : []), ...(products.status === 'fulfilled' ? products.value.map(productItem) : [])] };
  }
};

export const toStoreItem = { event: eventItem, product: productItem, course: courseItem };
