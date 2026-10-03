export type CepAddress = {
  cep: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
};

type ViaCepResponse = {
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

export async function findAddressByCep(value: string, signal?: AbortSignal): Promise<CepAddress> {
  const cep = value.replace(/\D/g, '');
  if (cep.length !== 8) throw new Error('Informe os 8 números do CEP.');

  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, { signal });
  if (!response.ok) throw new Error('Não foi possível consultar o CEP.');
  const data = await response.json() as ViaCepResponse;
  if (data.erro) throw new Error('CEP não encontrado.');

  return {
    cep: data.cep ?? cep,
    address: data.logradouro ?? '',
    neighborhood: data.bairro ?? '',
    city: data.localidade ?? '',
    state: data.uf ?? ''
  };
}
