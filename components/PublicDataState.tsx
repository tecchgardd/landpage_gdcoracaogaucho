import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';

export function SkeletonRow({ count = 4, className = 'h-40 w-[260px]' }: { count?: number; className?: string }) {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={`shrink-0 animate-pulse rounded-lg bg-black/10 ${className}`} />
      ))}
    </div>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="mx-auto max-w-xl rounded-xl border border-black/5 bg-white p-8 text-center shadow-lg shadow-black/5">
      <FontAwesomeIcon icon={faCalendarDays} className="text-3xl text-gaucho-red" />
      <h3 className="mt-4 text-xl font-black">{title}</h3>
      <p className="mt-2 leading-7 text-black/65">{text}</p>
    </div>
  );
}

export function ErrorState({ text }: { text: string }) {
  return (
    <div className="mx-auto max-w-xl rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-800">
      <p className="font-bold">{text}</p>
    </div>
  );
}
