'use client';
import { useEffect, useState } from 'react';
export const pageBackgroundVideos = { home: '/videos/v1.mp4', about: '/videos/v2.mp4', blog: '/videos/v3.mp4', contact: '/videos/v3.mp4', ticketing: '/videos/v1.mp4' } as const;
export function VideoBackground({ page, poster = '/assets/bg-hero.png', position = 'center' }: { page: keyof typeof pageBackgroundVideos; poster?: string; position?: string }) {
  const [reduced, setReduced] = useState(true);
  useEffect(() => { const media = window.matchMedia('(prefers-reduced-motion: reduce)'); const sync = () => setReduced(media.matches); sync(); media.addEventListener('change', sync); return () => media.removeEventListener('change', sync); }, []);
  return <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden" style={{ backgroundImage: `url(${poster})`, backgroundPosition: position, backgroundSize: 'cover' }}>{!reduced && <video autoPlay muted loop playsInline preload="metadata" poster={poster} className="h-full w-full object-cover" style={{ objectPosition: position }}><source src={pageBackgroundVideos[page]} type="video/mp4" /></video>}</div>;
}
