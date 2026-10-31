'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faChevronRight, faCircleCheck, faFileLines, faLaptop, faPlay, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/components/providers/AuthProvider';
import { useCourseSession } from '@/components/courses/useCourseSession';
import { courseAccessService, type Classroom, type ClassroomLesson, type Playback } from '@/services/courses/courseAccessService';

export default function ClassroomPage({ params }: { params: { curso: string } }) {
  return <Suspense fallback={<Shell><Skeleton /></Shell>}><ClassroomGate slug={params.curso} /></Suspense>;
}

function ClassroomGate({ slug }: { slug: string }) {
  const { user, loading } = useAuth(); const router = useRouter();
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { if (!loading && !user) router.replace(`/login?returnTo=${encodeURIComponent(`/aulas/${slug}`)}`); }, [loading, user, router, slug]);
  useEffect(() => { if (user) courseAccessService.classroom(slug).then(setClassroom).catch((caught) => setError(caught instanceof Error ? caught.message : 'Não foi possível abrir o curso.')); }, [user, slug]);
  if (error) return <Shell><Notice title="Curso indisponível" text={error} action={<Link href="/minha-conta/cursos" className="rounded-xl bg-gaucho-gold px-6 py-3 font-black text-black">Ver meus cursos</Link>} /></Shell>;
  if (!user || !classroom) return <Shell><Skeleton /></Shell>;
  if (classroom.access.status !== 'ATIVO') return <Shell><Notice title="Acesso expirado" text="O período de acesso a este curso terminou. Você pode renovar pela loja." action={<Link href={`/loja/cursos/${classroom.access.course.slug}`} className="rounded-xl bg-gaucho-gold px-6 py-3 font-black text-black">Renovar acesso</Link>} /></Shell>;
  return <Room classroom={classroom} email={user.email} />;
}

function Room({ classroom, email }: { classroom: Classroom; email: string }) {
  const params = useSearchParams(); const router = useRouter();
  const session = useCourseSession(classroom.access.course.id);
  const lessons = useMemo(() => classroom.modules.flatMap((module) => module.lessons), [classroom]);
  const [done, setDone] = useState(() => new Set(lessons.filter((lesson) => lesson.completed).map((lesson) => lesson.id)));
  const currentId = params.get('aula') ?? classroom.access.lastLessonId ?? lessons[0]?.id;
  const index = Math.max(0, lessons.findIndex((lesson) => lesson.id === currentId));
  const lesson = lessons[index]; const next = lessons[index + 1];
  const open = (id: string) => router.replace(`/aulas/${classroom.access.course.slug}?aula=${id}`, { scroll: false });
  const complete = async (target: ClassroomLesson) => { setDone((current) => new Set(current).add(target.id)); await courseAccessService.saveProgress(target.id, { seconds: 0, completed: true }).catch(() => undefined); };
  const percent = lessons.length ? Math.round((done.size / lessons.length) * 100) : 0;

  return <Shell>
    <div className="mx-auto grid max-w-[1400px] gap-6 px-4 pb-16 pt-28 lg:grid-cols-[1fr_380px] lg:px-6">
      <div>
        <Link href="/minha-conta/cursos" className="inline-flex items-center gap-2 text-sm font-bold text-white/55 hover:text-gaucho-gold"><FontAwesomeIcon icon={faArrowLeft} />Meus cursos</Link>
        <div className="relative mt-4 aspect-video overflow-hidden rounded-2xl bg-black ring-1 ring-white/10">
          {session.status === 'active' && session.sessionId && lesson ? <Player key={lesson.id} lessonId={lesson.id} sessionId={session.sessionId} email={email} onEnded={() => complete(lesson)} />
            : session.status === 'limit' ? <DeviceLimit devices={session.devices ?? []} message={session.message} onFree={session.freeDevice} />
            : session.status === 'revoked' || session.status === 'error' ? <Notice compact title={session.status === 'revoked' ? 'Sessão encerrada' : 'Não foi possível abrir a aula'} text={session.message ?? ''} action={<button onClick={session.retry} className="rounded-xl bg-gaucho-gold px-6 py-3 font-black text-black">Assistir neste aparelho</button>} />
            : <div className="flex h-full items-center justify-center text-sm text-white/50">Preparando a aula…</div>}
        </div>
        {lesson && <div className="mt-6 flex flex-wrap items-start justify-between gap-4"><div><p className="eyebrow text-gaucho-gold">Aula {index + 1} de {lessons.length}</p><h1 className="mt-2 font-display text-3xl font-black md:text-4xl">{lesson.title}</h1></div><div className="flex gap-2"><button onClick={() => complete(lesson)} disabled={done.has(lesson.id)} className="rounded-xl border border-white/20 px-4 py-3 text-sm font-black transition hover:border-gaucho-gold disabled:border-gaucho-green disabled:text-green-400"><FontAwesomeIcon icon={done.has(lesson.id) ? faCircleCheck : faCheck} className="mr-2" />{done.has(lesson.id) ? 'Concluída' : 'Marcar como concluída'}</button>{next && <button onClick={() => open(next.id)} className="btn-premium rounded-xl bg-gaucho-red px-5 py-3 text-sm font-black">Próxima<FontAwesomeIcon icon={faChevronRight} className="ml-2" /></button>}</div></div>}
        {lesson?.description && <p className="mt-4 max-w-3xl leading-7 text-white/70">{lesson.description}</p>}
        {lesson?.materials?.length ? <div className="mt-5 flex flex-wrap gap-2">{lesson.materials.map((material) => <a key={material.label} href={material.url} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-white/5 px-4 py-3 text-sm font-bold ring-1 ring-white/10 hover:bg-white/10"><FontAwesomeIcon icon={faFileLines} className="mr-2 text-gaucho-gold" />{material.label}</a>)}</div> : null}
      </div>
      <aside className="h-fit overflow-hidden rounded-2xl bg-white/[.04] ring-1 ring-white/10 lg:sticky lg:top-6">
        <div className="border-b border-white/10 p-5"><b className="font-display text-xl">{classroom.access.course.title}</b><div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div className="flag-sash h-full transition-all duration-700" style={{ width: `${percent}%` }} /></div><p className="mt-2 text-xs text-white/50">{percent}% concluído • {done.size} de {lessons.length} aulas</p></div>
        <div className="max-h-[60vh] overflow-y-auto p-3">{classroom.modules.map((module, moduleIndex) => <div key={module.id} className="mb-3"><p className="px-3 py-2 font-label text-xs font-bold uppercase tracking-widest text-white/40">Módulo {moduleIndex + 1} • {module.title}</p>{module.lessons.map((item) => <button key={item.id} onClick={() => open(item.id)} aria-current={item.id === lesson?.id} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${item.id === lesson?.id ? 'bg-gaucho-gold/15 text-gaucho-gold' : 'hover:bg-white/5'}`}><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] ${done.has(item.id) ? 'bg-gaucho-green text-white' : 'bg-white/10'}`}><FontAwesomeIcon icon={done.has(item.id) ? faCheck : faPlay} /></span><span className="flex-1">{item.title}</span>{item.durationMinutes && <span className="text-xs text-white/40">{item.durationMinutes}min</span>}</button>)}</div>)}</div>
        <p className="border-t border-white/10 p-4 text-xs text-white/45"><FontAwesomeIcon icon={faLaptop} className="mr-2" />Acesso pessoal • até {classroom.access.course.maxDevices} aparelhos ao mesmo tempo • código {classroom.access.code}</p>
      </aside>
    </div>
  </Shell>;
}

function Player({ lessonId, sessionId, email, onEnded }: { lessonId: string; sessionId: string; email: string; onEnded: () => void }) {
  const [playback, setPlayback] = useState<Playback | null>(null);
  const [error, setError] = useState('');
  const lastSave = useRef(0);
  const [mark, setMark] = useState({ x: 8, y: 10 });
  useEffect(() => { courseAccessService.playback(lessonId, sessionId).then(setPlayback).catch((caught) => setError(caught instanceof Error ? caught.message : 'Vídeo indisponível.')); }, [lessonId, sessionId]);
  useEffect(() => { const timer = setInterval(() => setMark({ x: 5 + Math.random() * 60, y: 6 + Math.random() * 70 }), 9000); return () => clearInterval(timer); }, []);
  const progress = (seconds: number) => { if (seconds - lastSave.current < 15) return; lastSave.current = seconds; courseAccessService.saveProgress(lessonId, { seconds: Math.floor(seconds), completed: false }).catch(() => undefined); };
  if (error) return <Notice compact title="Vídeo indisponível" text={error} />;
  if (!playback) return <div className="h-full w-full animate-pulse bg-white/5" />;
  return <div className="relative h-full w-full" onContextMenu={(event) => event.preventDefault()}>
    {playback.kind === 'embed' ? <iframe src={playback.url} title="Aula" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="h-full w-full" /> : <video src={playback.url} controls autoPlay playsInline controlsList="nodownload noremoteplayback" disablePictureInPicture onTimeUpdate={(event) => progress(event.currentTarget.currentTime)} onEnded={onEnded} className="h-full w-full bg-black" />}
    <span aria-hidden="true" className="pointer-events-none absolute select-none font-label text-xs font-bold tracking-wider text-white/25 transition-all duration-[2000ms]" style={{ left: `${mark.x}%`, top: `${mark.y}%` }}>{email}</span>
  </div>;
}

function DeviceLimit({ devices, message, onFree }: { devices: Array<{ id: string; name: string; lastSeenAt: string; current: boolean; watching?: string | null }>; message?: string; onFree: (id: string) => Promise<void> }) {
  const [busy, setBusy] = useState('');
  return <div className="flex h-full items-center justify-center overflow-y-auto p-6"><div className="w-full max-w-md text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gaucho-gold/15 text-2xl text-gaucho-gold"><FontAwesomeIcon icon={faTriangleExclamation} /></span><h2 className="mt-4 font-display text-2xl font-black">Limite de aparelhos atingido</h2><p className="mt-2 text-sm text-white/60">{message ?? 'Sua conta já está assistindo em outros aparelhos.'} Encerre uma sessão para assistir aqui.</p><ul className="mt-5 space-y-2 text-left">{devices.filter((device) => !device.current).map((device) => <li key={device.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 p-3 ring-1 ring-white/10"><span><b className="block text-sm">{device.name}</b><span className="text-xs text-white/45">{device.watching ? `Assistindo: ${device.watching}` : `Visto por último ${new Date(device.lastSeenAt).toLocaleString('pt-BR')}`}</span></span><button disabled={Boolean(busy)} onClick={async () => { setBusy(device.id); await onFree(device.id).finally(() => setBusy('')); }} className="shrink-0 rounded-lg bg-gaucho-red px-3 py-2 text-xs font-black disabled:opacity-50">{busy === device.id ? 'Encerrando…' : 'Encerrar'}</button></li>)}</ul></div></div>;
}

function Shell({ children }: { children: React.ReactNode }) { return <main className="min-h-screen bg-gaucho-night text-white"><Header />{children}</main>; }
function Skeleton() { return <div className="mx-auto grid max-w-[1400px] gap-6 px-6 pt-28 lg:grid-cols-[1fr_380px]"><div className="aspect-video animate-pulse rounded-2xl bg-white/5" /><div className="h-96 animate-pulse rounded-2xl bg-white/5" /></div>; }
function Notice({ title, text, action, compact = false }: { title: string; text: string; action?: React.ReactNode; compact?: boolean }) { return <div className={`flex flex-col items-center justify-center px-6 text-center ${compact ? 'h-full' : 'pt-44'}`}><h1 className="font-display text-3xl font-black">{title}</h1><p className="mt-3 max-w-md text-white/60">{text}</p>{action && <div className="mt-6">{action}</div>}</div>; }
