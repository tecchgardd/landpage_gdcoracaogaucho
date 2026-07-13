'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { AutoCarousel } from './AutoCarousel';
import { ErrorState, SkeletonRow } from './PublicDataState';
import { publicCompanyService } from '@/services/public/publicCompanyService';
import type { PublicEmpresa } from '@/services/public/types';

export function PublicCompaniesCarousel() {
  const [items, setItems] = useState<PublicEmpresa[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(false);
  useEffect(() => { let active = true; publicCompanyService.list().then((data) => active && setItems(data)).catch(() => active && setError(true)).finally(() => active && setLoading(false)); return () => { active = false; }; }, []);
  if (loading) return <SkeletonRow count={5} className="h-36 w-48" />;
  if (error) return <ErrorState text="Não foi possível carregar nossos apoiadores agora." />;
  if (!items.length) return <p className="py-6 text-center text-sm text-black/55">Em breve, novas empresas parceiras estarão conosco.</p>;
  if (items.length === 1) return <CompanyCard company={items[0]} />;
  return <AutoCarousel itemClassName="w-[160px] sm:w-[190px] md:w-[210px]" speed="slow">{items.map((item) => <CompanyCard key={item.id} company={item} />)}</AutoCarousel>;
}
function CompanyCard({ company }: { company: PublicEmpresa }) { return <article className="rounded-xl border border-black/5 bg-white p-4 text-center shadow-lg shadow-black/5"><div className="relative mx-auto h-24 w-full"><Image src={company.imagemUrl} alt={`Logo da empresa ${company.nome}`} fill sizes="210px" className="object-contain" /></div><h3 className="mt-3 truncate text-sm font-black text-gaucho-green">{company.nome}</h3></article>; }
