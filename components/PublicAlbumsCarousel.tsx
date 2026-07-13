'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { AutoCarousel } from '@/components/AutoCarousel';
import { EmptyState, ErrorState, SkeletonRow } from '@/components/PublicDataState';
import { publicAlbumService } from '@/services/public/publicAlbumService';
import { PublicAlbum } from '@/services/public/types';

export function PublicAlbumsCarousel() {
  const [albums, setAlbums] = useState<PublicAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    publicAlbumService
      .list()
      .then((items) => {
        if (active) setAlbums(items);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) return <SkeletonRow count={5} className="h-[230px] w-[210px]" />;
  if (error) return <ErrorState text="Não foi possível carregar os álbuns agora. Tente novamente em instantes." />;
  if (albums.length === 0) {
    return (
      <EmptyState
        title="Nenhum álbum disponível no momento"
        text="Em breve teremos novos registros para compartilhar com você."
      />
    );
  }

  return (
    <AutoCarousel itemClassName="w-[190px] md:w-[210px]" speed="normal">
      {albums.map((album) => (
        <article key={album.id} className="group overflow-hidden rounded-lg bg-black text-white shadow-xl shadow-black/20">
          <div className="relative h-[118px] bg-gaucho-green/40">
            {album.coverImage ? (
              <Image src={album.coverImage} alt={album.title} fill className="object-cover opacity-90 transition duration-500 group-hover:scale-105" />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>
          <div className="-mt-2 p-4 pt-0">
            <h3 className="font-display text-xl font-black leading-tight">{album.title}</h3>
            <p className="mt-2 text-xs text-white/85">
              <FontAwesomeIcon icon={faImage} className="mr-2" />
              {album.photoCount ?? 0} Fotos
              {album.city ? ` • ${album.city}` : ''}
            </p>
            <Link href={`/blog/${album.slug}`} className="mt-3 block rounded-full bg-gaucho-green py-2 text-center text-xs font-black uppercase">
              Ver mais
            </Link>
          </div>
        </article>
      ))}
    </AutoCarousel>
  );
}
