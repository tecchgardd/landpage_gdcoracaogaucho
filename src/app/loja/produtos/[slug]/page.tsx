'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faMinus, faPlus, faTruckFast } from '@fortawesome/free-solid-svg-icons';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/components/providers/CartProvider';
import { storeService } from '@/services/store/storeService';
import type { Product, ProductVariant } from '@/services/store/types';
import { formatCurrency } from '@/utils/publicFormatters';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const cart = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState(false);
  const [image, setImage] = useState(0);
  const [variant, setVariant] = useState<ProductVariant>();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  useEffect(() => { storeService.product(params.slug).then((data) => { setProduct(data); setVariant(data.variants.length === 1 ? data.variants[0] : undefined); }).catch(() => setError(true)); }, [params.slug]);

  if (error) return <State text="Produto não encontrado." />;
  if (!product) return <main className="min-h-screen bg-gaucho-paper"><Header active="loja" /><div className="mx-auto grid max-w-6xl gap-8 px-6 pt-36 md:grid-cols-2"><div className="aspect-square animate-pulse rounded-3xl bg-black/10" /><div className="h-80 animate-pulse rounded-3xl bg-black/10" /></div></main>;
  const needsVariant = product.variants.length > 1 && !variant;
  const unavailable = product.soldOut || (variant?.available === 0);
  const add = () => { if (needsVariant || unavailable) return; cart.addProduct(product, variant, quantity); setAdded(true); };

  return <main className="min-h-screen bg-gaucho-paper text-gaucho-ink"><Header active="loja" />
    <section className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <Link href="/loja?categoria=produtos" className="inline-flex items-center gap-2 text-sm font-bold text-black/55 hover:text-gaucho-green"><FontAwesomeIcon icon={faArrowLeft} />Produtos</Link>
      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div><div className="relative aspect-square overflow-hidden rounded-3xl bg-white shadow-xl">{product.images[image] && <Image src={product.images[image]} alt={product.title} fill priority sizes="(max-width:768px) 90vw, 560px" className="object-cover" />}</div>{product.images.length > 1 && <div className="mt-3 flex gap-3">{product.images.map((src, index) => <button key={src} onClick={() => setImage(index)} aria-label={`Imagem ${index + 1}`} className={`relative h-20 w-20 overflow-hidden rounded-xl ring-2 ${index === image ? 'ring-gaucho-green' : 'ring-transparent'}`}><Image src={src} alt="" fill sizes="80px" className="object-cover" /></button>)}</div>}</div>
        <div>
          {product.category && <p className="eyebrow text-gaucho-red">{product.category}</p>}
          <h1 className="mt-2 font-display text-4xl font-black leading-tight md:text-5xl">{product.title}</h1>
          <p className="mt-5 flex items-baseline gap-3"><b className="text-3xl">{formatCurrency(variant?.price ?? product.price)}</b>{product.compareAtPrice && <span className="text-black/40 line-through">{formatCurrency(product.compareAtPrice)}</span>}</p>
          
          {product.description && <p className="mt-6 leading-7 text-black/70">{product.description}</p>}
          {product.variants.length > 1 && <fieldset className="mt-7"><legend className="font-label text-sm font-bold uppercase tracking-wider">Tamanho</legend><div className="mt-3 flex flex-wrap gap-2">{product.variants.map((option) => <button key={option.id} disabled={option.available === 0} onClick={() => { setVariant(option); setAdded(false); }} aria-pressed={variant?.id === option.id} className={`h-12 min-w-12 rounded-xl border px-4 font-black transition disabled:cursor-not-allowed disabled:opacity-30 ${variant?.id === option.id ? 'border-gaucho-ink bg-gaucho-ink text-white' : 'border-black/15 bg-white hover:border-gaucho-ink'}`}>{option.label}</button>)}</div></fieldset>}
          <div className="mt-7 flex flex-wrap items-center gap-3"><div className="flex h-14 items-center rounded-xl border border-black/15 bg-white"><button aria-label="Diminuir" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="h-full px-4"><FontAwesomeIcon icon={faMinus} /></button><b className="w-8 text-center">{quantity}</b><button aria-label="Aumentar" onClick={() => setQuantity((value) => Math.min(20, value + 1))} className="h-full px-4"><FontAwesomeIcon icon={faPlus} /></button></div><button onClick={add} disabled={needsVariant || unavailable} className="btn-premium h-14 flex-1 rounded-xl bg-gaucho-red px-6 font-black uppercase text-white disabled:opacity-40">{unavailable ? 'Esgotado' : needsVariant ? 'Escolha o tamanho' : 'Adicionar ao carrinho'}</button></div>
          {added && <p className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 p-4 text-sm font-bold text-gaucho-green"><FontAwesomeIcon icon={faCheck} />Adicionado! <Link href="/carrinho" className="underline underline-offset-4">Ver carrinho</Link></p>}
          <p className="mt-6 flex items-center gap-3 border-t border-black/10 pt-6 text-sm text-black/60"><FontAwesomeIcon icon={faTruckFast} className="text-gaucho-green" />Retirada combinada com o grupo (ensaios e bailes) depois da confirmação do pagamento.</p>
        </div>
      </div>
    </section><Footer /></main>;
}

function State({ text }: { text: string }) { return <main className="min-h-screen bg-gaucho-paper"><Header active="loja" /><div className="px-6 pt-44 text-center"><h1 className="font-display text-4xl font-black">{text}</h1><Link href="/loja" className="mt-6 inline-block rounded-xl bg-gaucho-red px-6 py-3 font-black text-white">Voltar para a loja</Link></div></main>; }
