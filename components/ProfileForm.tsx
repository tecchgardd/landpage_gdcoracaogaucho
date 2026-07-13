'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { meService, type Profile } from '@/services/meService';
import { useAuth } from './providers/AuthProvider';

const STATES = [
  ['AC', 'Acre'], ['AL', 'Alagoas'], ['AP', 'Amapá'], ['AM', 'Amazonas'], ['BA', 'Bahia'], ['CE', 'Ceará'], ['DF', 'Distrito Federal'],
  ['ES', 'Espírito Santo'], ['GO', 'Goiás'], ['MA', 'Maranhão'], ['MT', 'Mato Grosso'], ['MS', 'Mato Grosso do Sul'], ['MG', 'Minas Gerais'],
  ['PA', 'Pará'], ['PB', 'Paraíba'], ['PR', 'Paraná'], ['PE', 'Pernambuco'], ['PI', 'Piauí'], ['RJ', 'Rio de Janeiro'], ['RN', 'Rio Grande do Norte'],
  ['RS', 'Rio Grande do Sul'], ['RO', 'Rondônia'], ['RR', 'Roraima'], ['SC', 'Santa Catarina'], ['SP', 'São Paulo'], ['SE', 'Sergipe'], ['TO', 'Tocantins']
] as const;

const formatCpf = (value: string) => value.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');

const emptyProfile = (user: { id: string; name?: string; email?: string }): Profile => ({
  userId: user.id, name: user.name ?? '', email: user.email ?? '', cpf: '', phone: '', birthDate: '', gender: '', cep: '',
  address: '', number: '', complement: '', neighborhood: '', state: '', city: '', complete: false
});

export function ProfileForm() {
  const { user } = useAuth();
  const params = useSearchParams();
  const requestedReturn = params?.get('returnTo');
  const returnTo = requestedReturn?.startsWith('/') ? requestedReturn : '';
  const [profile, setProfile] = useState<Profile | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [cpfLocked, setCpfLocked] = useState(false);

  useEffect(() => {
    if (!user) return;
    setProfile(emptyProfile(user));
    meService.profile().then((data) => { setProfile(data); setCpfLocked(data.cpf.replace(/\D/g, '').length === 11); setError(''); }).catch((caught) => setError(caught instanceof Error ? caught.message : 'Não foi possível carregar seus dados salvos.'));
  }, [user]);

  if (!profile) return <div className="h-96 animate-pulse rounded-xl bg-black/10" />;

  const update = (field: keyof Profile, value: string) => setProfile({ ...profile, [field]: value, complete: false });
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true); setMessage(''); setError('');
    try {
      const saved = await meService.updateProfile(profile);
      setProfile(saved);
      setCpfLocked(true);
      setMessage('Dados completos e salvos com sucesso. Você já pode finalizar suas compras.');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Falha ao salvar os dados.');
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={save} className="overflow-hidden rounded-2xl bg-white shadow-lg">
      {!profile.complete && <div className="border-b border-amber-200 bg-amber-50 px-6 py-4 text-sm font-bold text-amber-900">Complete todos os campos obrigatórios para poder finalizar pedidos no checkout.</div>}
      <div className="p-6 md:p-8">
        <Step number="1" title="Dados pessoais">
          <div className="grid gap-5 sm:grid-cols-2">
            <ProfileField label="Nome completo" value={profile.name} disabled={Boolean(profile.name)} onChange={(value) => update('name', value)} autoComplete="name" className="sm:col-span-2" required />
            <ProfileField label="E-mail" value={profile.email} disabled autoComplete="email" className="sm:col-span-2" required />
            <ProfileField label="CPF" value={formatCpf(profile.cpf)} disabled={cpfLocked} onChange={(value) => update('cpf', formatCpf(value))} autoComplete="off" inputMode="numeric" placeholder="000.000.000-00" required />
            <ProfileField label="Data de nascimento" type="date" value={profile.birthDate} onChange={(value) => update('birthDate', value)} autoComplete="bday" required />
            <fieldset className="sm:col-span-2">
              <legend className="mb-3 text-sm font-bold text-black/75">Sexo <Required /></legend>
              <div className="flex flex-wrap gap-6">
                {[['MASCULINO', 'Masculino'], ['FEMININO', 'Feminino'], ['OUTRO', 'Outro'], ['NAO_INFORMADO', 'Prefiro não informar']].map(([value, label]) => <label key={value} className="flex items-center gap-2 text-sm font-bold"><input required type="radio" name="gender" value={value} checked={profile.gender === value} onChange={() => update('gender', value)} className="h-4 w-4 accent-gaucho-green" />{label}</label>)}
              </div>
            </fieldset>
            <ProfileField label="Celular / Telefone" type="tel" value={profile.phone} onChange={(value) => update('phone', value)} autoComplete="tel" placeholder="Informe seu telefone principal" className="sm:col-span-2" required />
          </div>
        </Step>

        <Step number="2" title="Endereço">
          <div className="grid gap-5 sm:grid-cols-2">
            <ProfileField label="CEP" value={profile.cep} onChange={(value) => update('cep', value)} autoComplete="postal-code" required />
            <ProfileField label="Endereço" value={profile.address} onChange={(value) => update('address', value)} autoComplete="address-line1" className="sm:col-span-2" required />
            <ProfileField label="Número" value={profile.number} onChange={(value) => update('number', value)} autoComplete="address-line2" required />
            <ProfileField label="Complemento" value={profile.complement} onChange={(value) => update('complement', value)} autoComplete="address-line2" placeholder="Opcional" />
            <ProfileField label="Bairro" value={profile.neighborhood} onChange={(value) => update('neighborhood', value)} autoComplete="address-level3" className="sm:col-span-2" required />
            <label className="grid gap-1.5 text-sm font-bold text-black/75"><span>Estado <Required /></span><select required value={profile.state} onChange={(event) => update('state', event.target.value)} autoComplete="address-level1" className={inputClass}><option value="">Selecione o estado</option>{STATES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <ProfileField label="Cidade" value={profile.city} onChange={(value) => update('city', value)} autoComplete="address-level2" required />
          </div>
        </Step>

        {error && <p className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {message && <p className="mt-6 rounded-lg bg-green-50 p-3 text-sm font-bold text-gaucho-green">{message}</p>}
        <div className="mt-7 flex flex-wrap items-center gap-4"><button disabled={saving} className="w-full rounded-lg bg-gaucho-green px-6 py-4 font-black text-white disabled:opacity-50 md:max-w-sm">{saving ? 'Salvando…' : 'Salvar dados'}</button>{profile.complete && returnTo && <Link href={returnTo} className="font-bold text-gaucho-green">Voltar ao checkout →</Link>}</div>
      </div>
    </form>
  );
}

const inputClass = 'rounded-lg border border-black/15 bg-white p-3 font-normal text-black outline-none transition focus:border-gaucho-green focus:ring-2 focus:ring-gaucho-green/15 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-black/60';

function Step({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return <section className="relative border-l border-black/10 pb-10 pl-8 last:pb-0"><span className="absolute -left-4 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-sm text-black/35">{number}</span><h2 className="mb-6 text-xl font-black">{title}</h2>{children}</section>;
}

function Required() { return <span className="text-gaucho-red">*</span>; }

function ProfileField({ label, value, onChange, disabled = false, autoComplete, type = 'text', inputMode, placeholder, className = '', required = false }: { label: string; value: string; onChange?: (value: string) => void; disabled?: boolean; autoComplete: string; type?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']; placeholder?: string; className?: string; required?: boolean }) {
  return <label className={`grid gap-1.5 text-sm font-bold text-black/75 ${className}`}><span>{label} {required && <Required />}</span><input required={required} type={type} inputMode={inputMode} value={value} onChange={(event) => onChange?.(event.target.value)} disabled={disabled} autoComplete={autoComplete} placeholder={placeholder} className={inputClass} /></label>;
}
