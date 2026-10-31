'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faPlay } from '@fortawesome/free-solid-svg-icons';
import { AccountShell } from '@/components/account/AccountShell';
import { useAuth } from '@/components/providers/AuthProvider';
import { courseAccessService, type CourseAccess } from '@/services/courses/courseAccessService';

export default function MyCoursesPage() {
  return <AccountShell title="Meus cursos online"><Courses /></AccountShell>;
}

function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseAccess[] | null>(null);
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [redeem, setRedeem] = useState<{ busy: boolean; message?: string; ok?: boolean }>({ busy: false });
  const load = () => courseAccessService.myCourses().then(setCourses).catch((caught) => setError(caught instanceof Error ? caught.message : 'Não foi possível carregar seus cursos.'));
  useEffect(() => { if (user) load(); }, [user]);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); if (!code.trim()) return;
    setRedeem({ busy: true });
    try { const access = await courseAccessService.redeem(code); setRedeem({ busy: false, ok: true, message: `Pronto! “${access.course.title}” foi liberado na sua conta.` }); setCode(''); load(); }
    catch (caught) { setRedeem({ busy: false, message: caught instanceof Error ? caught.message : 'Código inválido.' }); }
  };

  return <div className="space-y-8">
    {error ? <p className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p> : !courses ? <div className="h-48 animate-pulse rounded-2xl bg-black/5" /> : courses.length === 0 ? <div className="rounded-2xl bg-white p-8 text-center shadow-lg"><h2 className="font-display text-2xl font-black">Você ainda não tem cursos online</h2><p className="mt-2 text-black/55">Aprenda a dançar em casa com as aulas gravadas pelos professores do grupo.</p><Link href="/loja?categoria=cursos-online" className="btn-premium mt-6 inline-block rounded-xl bg-gaucho-red px-6 py-3 font-black text-white">Conhecer os cursos</Link></div> : <div className="grid gap-5 md:grid-cols-2">{courses.map((access) => <article key={access.id} className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5"><div className="relative aspect-[16/8] bg-gaucho-ink">{access.course.image && <Image src={access.course.image} alt="" fill sizes="(max-width:768px) 90vw, 420px" className="object-cover opacity-80" />}<span className={`absolute left-3 top-3 rounded-full px-3 py-1 font-label text-xs font-bold uppercase tracking-wider ${access.status === 'ATIVO' ? 'bg-gaucho-green text-white' : 'bg-black/70 text-white'}`}>{access.status === 'ATIVO' ? 'Acesso ativo' : access.status === 'EXPIRADO' ? 'Expirado' : 'Revogado'}</span></div><div className="p-5"><h2 className="font-display text-xl font-black">{access.course.title}</h2><div className="mt-3 h-2 overflow-hidden rounded-full bg-black/10"><div className="flag-sash h-full" style={{ width: `${access.progressPercent}%` }} /></div><p className="mt-2 text-xs text-black/50">{access.progressPercent}% concluído{access.expiresAt && ` • acesso até ${new Date(access.expiresAt).toLocaleDateString('pt-BR')}`}</p><p className="mt-1 text-xs text-black/50">Código de acesso: <b className="font-mono tracking-wider text-black/70">{access.code}</b></p>{access.status === 'ATIVO' ? <Link href={`/aulas/${access.course.slug}${access.lastLessonId ? `?aula=${access.lastLessonId}` : ''}`} className="btn-premium mt-5 inline-flex items-center gap-2 rounded-xl bg-gaucho-green px-5 py-3 text-sm font-black text-white"><FontAwesomeIcon icon={faPlay} />{access.progressPercent > 0 ? 'Continuar' : 'Começar'}</Link> : <Link href={`/loja/cursos/${access.course.slug}`} className="mt-5 inline-block rounded-xl border border-black/15 px-5 py-3 text-sm font-black">Renovar acesso</Link>}</div></article>)}</div>}

    <form onSubmit={submit} className="rounded-2xl bg-gaucho-ink p-6 text-white"><h2 className="flex items-center gap-2 font-display text-xl font-black"><FontAwesomeIcon icon={faKey} className="text-gaucho-gold" />Tenho um código de acesso</h2><p className="mt-1 text-sm text-white/60">Ganhou o curso de presente ou comprou no balcão do grupo? Digite o código para vincular à sua conta.</p><div className="mt-4 flex flex-col gap-2 sm:flex-row"><input value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} maxLength={16} placeholder="EX.: VAN3RA24" aria-label="Código de acesso" className="flex-1 rounded-xl bg-white/10 px-4 py-3 font-mono tracking-widest outline-none ring-1 ring-white/15 placeholder:text-white/30 focus:ring-gaucho-gold" /><button disabled={redeem.busy} className="rounded-xl bg-gaucho-gold px-6 py-3 font-black text-black disabled:opacity-50">{redeem.busy ? 'Validando…' : 'Resgatar'}</button></div>{redeem.message && <p className={`mt-3 text-sm font-bold ${redeem.ok ? 'text-green-400' : 'text-red-300'}`}>{redeem.message}</p>}</form>
  </div>;
}
