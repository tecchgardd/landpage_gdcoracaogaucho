'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { publicAlbumService } from '@/services/public/publicAlbumService';
import type { PublicAlbum, PublicAlbumImage } from '@/services/public/types';
import { ErrorState, SkeletonRow } from './PublicDataState';

export function AlbumGallery({ slug }: { slug: string }) {
  const [album, setAlbum] = useState<PublicAlbum | null>(null);
  const [photos, setPhotos] = useState<PublicAlbumImage[]>([]);
  const [cursor, setCursor] = useState<string | null>();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const loadPhotos = useCallback(async (next?: string) => {
    const page = await publicAlbumService.getPhotos(slug, next, 40);
    setPhotos((current) => next ? [...new Map([...current, ...page.data].map((photo) => [photo.id, photo])).values()] : page.data);
    setCursor(page.nextCursor);
    setTotal(page.total);
  }, [slug]);

  useEffect(() => {
    let active = true;
    Promise.all([publicAlbumService.getBySlug(slug), publicAlbumService.getPhotos(slug, undefined, 40)])
      .then(([albumData, page]) => {
        if (!active) return;
        setAlbum(albumData);
        setPhotos(page.data);
        setCursor(page.nextCursor);
        setTotal(page.total);
      })
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [slug]);

  useEffect(() => {
    if (selected == null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
      if (event.key === 'ArrowRight') setSelected((value) => value == null ? null : (value + 1) % photos.length);
      if (event.key === 'ArrowLeft') setSelected((value) => value == null ? null : (value - 1 + photos.length) % photos.length);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [selected, photos.length]);

  if (loading) return <SkeletonRow count={6} className="h-64 w-72" />;
  if (error || !album) return <ErrorState text="Não foi possível carregar este álbum agora. Tente novamente em instantes." />;

  return (
    <>
      <div className="mb-8"><h1 className="font-display text-5xl font-black">{album.title}</h1><p className="mt-2 text-black/60">{total} fotos</p></div>
      {photos.length === 0 ? <p className="rounded-xl bg-white p-8 text-center">Este álbum ainda não possui fotos.</p> : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo, index) => (
            <button key={photo.id} onClick={() => setSelected(index)} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-black/10 shadow-lg">
              <Image src={photo.thumbnailUrl ?? photo.url} alt={photo.alt ?? album.title} fill loading="lazy" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-300 hover:scale-105" />
            </button>
          ))}
        </div>
      )}
      {cursor && <div className="mt-8 text-center"><button disabled={loadingMore} onClick={async () => { setLoadingMore(true); try { await loadPhotos(cursor); } finally { setLoadingMore(false); } }} className="rounded-full bg-gaucho-red px-8 py-3 font-black text-white disabled:opacity-50">{loadingMore ? 'Carregando…' : 'Carregar mais'}</button></div>}
      {selected != null && photos[selected] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4" onClick={() => setSelected(null)} role="dialog" aria-modal="true">
          <button aria-label="Fechar" className="absolute right-5 top-5 text-4xl text-white">×</button>
          <button aria-label="Foto anterior" onClick={(event) => { event.stopPropagation(); setSelected((selected - 1 + photos.length) % photos.length); }} className="absolute left-3 text-5xl text-white md:left-8">‹</button>
          <Image src={photos[selected].url} alt={photos[selected].alt ?? album.title} width={photos[selected].width ?? 1600} height={photos[selected].height ?? 1200} className="max-h-[90vh] w-auto max-w-[88vw] object-contain" priority />
          <button aria-label="Próxima foto" onClick={(event) => { event.stopPropagation(); setSelected((selected + 1) % photos.length); }} className="absolute right-3 text-5xl text-white md:right-8">›</button>
        </div>
      )}
    </>
  );
}
