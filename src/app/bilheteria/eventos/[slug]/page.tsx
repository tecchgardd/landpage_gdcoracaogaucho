import type { Metadata } from 'next';
import { EventDetailsPage } from './EventDetailsPage';
const API = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333').replace(/\/$/, '');
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> { try { const response = await fetch(`${API}/api/public/events/${encodeURIComponent(params.slug)}`, { cache: 'no-store' }); if (!response.ok) return { title: 'Evento | Coração Gaúcho' }; const event = await response.json() as { name?: string; banner?: string; description?: string }; return { title: `${event.name ?? 'Evento'} | Coração Gaúcho`, description: event.description, openGraph: { title: event.name, description: event.description, images: event.banner ? [{ url: event.banner }] : undefined } }; } catch { return { title: 'Evento | Coração Gaúcho' }; } }
export default function Page({ params }: { params: { slug: string } }) { return <EventDetailsPage slug={params.slug}/>; }
