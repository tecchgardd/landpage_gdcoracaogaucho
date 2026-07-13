'use client';

import { useEffect, useState } from 'react';
import { meService, type Profile } from '@/services/meService';
import { useAuth } from './providers/AuthProvider';

export function ProfileForm() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setProfile({ userId: user.id, name: user.name ?? '', email: user.email ?? '', cpf: '', phone: '', address: '', city: '', complete: false });
    meService.profile()
      .then((data) => { setProfile(data); setError(''); })
      .catch((caught) => setError(caught instanceof Error ? caught.message : 'Não foi possível carregar seus dados salvos.'));
  }, [user]);

  if (!profile) return <div className="h-52 animate-pulse rounded-xl bg-black/10" />;

  const save = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      setProfile({ ...profile, ...(await meService.updateProfile(profile)), complete: true });
      setMessage('Dados salvos com sucesso.');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Falha ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  const update = (field: keyof Profile, value: string) => setProfile({ ...profile, [field]: value, complete: false });

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg">
      <p className="mb-5 text-sm text-black/55">O e-mail é a credencial da conta e não pode ser alterado aqui.</p>
      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <ProfileField label="Nome completo" value={profile.name} onChange={(value) => update('name', value)} autoComplete="name" />
        <ProfileField label="E-mail" value={profile.email} disabled autoComplete="email" />
        <ProfileField label="CPF" value={profile.cpf} onChange={(value) => update('cpf', value)} autoComplete="off" />
        <ProfileField label="Telefone" value={profile.phone} onChange={(value) => update('phone', value)} autoComplete="tel" />
        <ProfileField label="Endereço" value={profile.address} onChange={(value) => update('address', value)} autoComplete="street-address" />
        <ProfileField label="Cidade" value={profile.city} onChange={(value) => update('city', value)} autoComplete="address-level2" />
      </div>
      {message && <p className="mt-4 text-sm font-bold text-gaucho-green">{message}</p>}
      <button onClick={save} disabled={saving} className="mt-5 rounded-lg bg-gaucho-green px-6 py-3 font-black text-white disabled:opacity-50">{saving ? 'Salvando…' : 'Salvar alterações'}</button>
    </div>
  );
}

function ProfileField({ label, value, onChange, disabled = false, autoComplete }: { label: string; value: string; onChange?: (value: string) => void; disabled?: boolean; autoComplete: string }) {
  return (
    <label className="grid gap-1.5 text-sm font-bold text-black/70">
      {label}
      <input value={value} onChange={(event) => onChange?.(event.target.value)} disabled={disabled} autoComplete={autoComplete} className="rounded-lg border border-black/20 p-3 font-normal text-black outline-none focus:border-gaucho-green focus:ring-2 focus:ring-gaucho-green/15 disabled:bg-black/5 disabled:text-black/50" />
    </label>
  );
}
