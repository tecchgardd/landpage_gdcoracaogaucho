import type { Metadata } from 'next';
import Link from 'next/link';
import { CONTACT_EMAIL, LegalPage } from '@/components/legal/LegalPage';
import { CookiePreferencesButton } from './CookiePreferencesButton';

export const metadata: Metadata = { title: 'Política de Cookies | Coração Gaúcho', description: 'Quais cookies o site do Coração Gaúcho usa e como gerenciar suas preferências.' };

const cookies: Array<[string, string, string, string]> = [
  ['cg-admin.session_token', 'Mantém você conectado à sua conta', 'Necessário', 'Até sair da conta ou expirar a sessão'],
  ['cg_cart', 'Guarda o carrinho de quem ainda não entrou na conta', 'Necessário', '30 dias'],
  ['cg_device', 'Identifica o aparelho nas aulas online (limite de aparelhos)', 'Necessário', '1 ano'],
  ['cg_checkout_order', 'Retoma o status do pedido na volta do pagamento', 'Necessário', '2 dias'],
  ['cg_consent', 'Guarda as suas escolhas sobre cookies', 'Necessário', '12 meses'],
  ['cg_cta', 'Lembra quais avisos e promoções você já viu', 'Preferências', '30 dias'],
  ['Cookies do YouTube (Google)', 'Player de músicas do grupo', 'Mídia de terceiros', 'Definido pelo Google']
];

export default function CookiesPage() {
  return <LegalPage current="/cookies" title="Política de Cookies" updatedAt="31 de outubro de 2026" intro="Cookies são pequenos arquivos que o site guarda no seu navegador. Usamos o mínimo possível: os necessários para login, carrinho e compras funcionarem e, só com a sua permissão, alguns para preferências e mídia de terceiros.">
    <h2>Quais cookies usamos</h2>
    <table><thead><tr><th>Cookie</th><th>Para que serve</th><th>Tipo</th><th>Duração</th></tr></thead><tbody>{cookies.map(([name, purpose, kind, duration]) => <tr key={name}><td><code>{name}</code></td><td>{purpose}</td><td>{kind}</td><td>{duration}</td></tr>)}</tbody></table>
    <p>Os cookies de sessão, carrinho e aparelho são criados pelo nosso servidor com as proteções httpOnly, Secure e SameSite: o código da página não consegue lê-los. Na página de pagamento, o gateway usa cookies próprios, regidos pela política dele.</p>
    <p>Também usamos o armazenamento da sessão do navegador (apagado ao fechar a aba) para não repetir a animação de abertura e lembrar se você fechou o player de músicas.</p>

    <h2>Tipos de cookies</h2>
    <ul>
      <li><b>Necessários:</b> sem eles o site não funciona (login, carrinho, compras, aulas). Não dependem de consentimento;</li>
      <li><b>Preferências:</b> deixam a navegação mais agradável, evitando repetir avisos. Só com o seu &ldquo;sim&rdquo;;</li>
      <li><b>Mídia de terceiros:</b> conteúdo de outras empresas, como o YouTube, que pode usar cookies próprios. Só com o seu &ldquo;sim&rdquo;.</li>
    </ul>
    <p>Hoje não usamos cookies de publicidade nem de rastreamento entre sites.</p>

    <h2>Como gerenciar</h2>
    <p>Você pode mudar suas escolhas a qualquer momento:</p>
    <CookiePreferencesButton />
    <p>Também é possível apagar ou bloquear cookies nas configurações do navegador. Bloquear os necessários impede o login e as compras.</p>
    <p>Dúvidas: {CONTACT_EMAIL}. Mais detalhes sobre o uso dos seus dados na <Link href="/privacidade">Política de Privacidade</Link>.</p>
  </LegalPage>;
}
