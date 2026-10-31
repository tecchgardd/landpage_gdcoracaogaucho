import Image from 'next/image';

export default function Loading() {
  return <div className="paper flex min-h-screen flex-col items-center justify-center gap-6 px-6" role="status" aria-label="Carregando">
    <Image src="/assets/logo.jpg" alt="" width={160} height={160} priority className="h-40 w-40 animate-pulse object-contain mix-blend-multiply" />
    <div className="flex h-2 w-48 overflow-hidden rounded-full"><span className="loading-bar flag-sash h-full" /></div>
  </div>;
}
