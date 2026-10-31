'use client';
import { useConsent } from '@/components/consent/ConsentProvider';

export function CookiePreferencesButton() {
  const { openPreferences } = useConsent();
  return <button onClick={openPreferences} className="mt-4 rounded-full bg-gaucho-ink px-6 py-3 text-sm font-bold text-white transition hover:bg-gaucho-green">Abrir preferências de cookies</button>;
}
