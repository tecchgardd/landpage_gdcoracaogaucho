'use client';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDesktop, faMobileScreen } from '@fortawesome/free-solid-svg-icons';
import { AccountShell } from '@/components/account/AccountShell';
import { useAuth } from '@/components/providers/AuthProvider';
import { courseAccessService, type CustomerDevice } from '@/services/courses/courseAccessService';

export default function DevicesPage() {
  return <AccountShell title="Dispositivos"><Devices /></AccountShell>;
}

function Devices() {
  const { user } = useAuth();
  const [devices, setDevices] = useState<CustomerDevice[] | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const load = () => courseAccessService.devices().then(setDevices).catch((caught) => setError(caught instanceof Error ? caught.message : 'Não foi possível carregar os aparelhos.'));
  useEffect(() => { if (user) load(); }, [user]);
  const revoke = async (id: string) => { setBusy(id); await courseAccessService.revokeDevice(id).catch(() => undefined); setBusy(''); load(); };

  return <div className="space-y-5">
    <p className="max-w-2xl text-black/60">Seus cursos online podem ser assistidos em até <b>2 aparelhos ao mesmo tempo</b>. Se você não reconhece algum aparelho, desconecte e troque sua senha.</p>
    {error ? <p className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p> : !devices ? <div className="h-40 animate-pulse rounded-2xl bg-black/5" /> : devices.length === 0 ? <p className="rounded-2xl bg-white p-6 text-black/55 shadow">Nenhum aparelho conectado às aulas ainda.</p> : <ul className="space-y-3">{devices.map((device) => <li key={device.id} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow ring-1 ring-black/5"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gaucho-ink text-lg text-gaucho-gold"><FontAwesomeIcon icon={/Android|iPhone/.test(device.name) ? faMobileScreen : faDesktop} /></span><div className="min-w-0 flex-1"><b className="block truncate">{device.name}{device.current && <span className="ml-2 rounded bg-gaucho-green/10 px-1.5 py-0.5 text-[11px] font-black text-gaucho-green">ESTE APARELHO</span>}</b><span className="text-sm text-black/50">{device.watching ? `Assistindo agora: ${device.watching}` : `Último acesso ${new Date(device.lastSeenAt).toLocaleString('pt-BR')}`}</span></div>{!device.current && <button disabled={busy === device.id} onClick={() => revoke(device.id)} className="shrink-0 rounded-xl border border-red-200 px-4 py-2 text-sm font-black text-red-700 hover:bg-red-50 disabled:opacity-50">{busy === device.id ? 'Desconectando…' : 'Desconectar'}</button>}</li>)}</ul>}
  </div>;
}
