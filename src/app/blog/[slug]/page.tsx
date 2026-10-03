import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AlbumGallery } from '@/components/catalog/AlbumGallery';

export default function AlbumPage({ params }: { params: { slug: string } }) {
  return <main className="min-h-screen bg-gaucho-cream text-black"><Header active="blog" /><section className="mx-auto max-w-7xl px-6 pb-24 pt-36"><AlbumGallery slug={params.slug} /></section><Footer /></main>;
}
