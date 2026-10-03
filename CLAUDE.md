# CLAUDE.md

Contexto de referência para Claude Code (e qualquer agente) trabalhar neste repositório. Este arquivo descreve o projeto **como ele é hoje**, não aspiracionalmente — mantenha-o atualizado quando a arquitetura mudar.

## 1. O que é este projeto

Landing page institucional + bilheteria online do **Grupo de Danças Coração Gaúcho** (GD Coração Gaúcho), grupo de dança tradicionalista gaúcha. O site tem duas faces:

1. **Institucional** (`/`, `/sobre`, `/blog`, `/curso`): apresentação do grupo, história, álbuns de fotos de formatura, turmas de curso.
2. **Bilheteria / e-commerce** (`/bilheteria`, `/carrinho`, `/checkout`, `/minha-conta/**`): catálogo de eventos/bailes/cursos, carrinho, autenticação de cliente, checkout com Stripe, histórico de pedidos, ingressos com QR code.

Este repositório é **somente o frontend**. O backend (API, banco, Stripe, auth) vive em outro repositório, hoje publicado em `https://backend-coracaogaucho.vercel.app` (configurável via `NEXT_PUBLIC_API_URL`). Não há código de backend aqui — ver seção 6.

## 2. Stack

- **Next.js 14** (App Router, código em `src/`) + React 18 + TypeScript 5 (`strict: true`)
- **Tailwind CSS 3** para estilos (classes inline, sem CSS Modules/styled-components)
- **Framer Motion** para animações de entrada (`src/components/ui/Motion.tsx`)
- **FontAwesome** (`@fortawesome/*`) para ícones
- **qrcode** para gerar QR code dos ingressos no cliente
- Testes: `node --test` nativo (sem Jest/Vitest) — ver seção 9
- Sem ORM/banco neste repo — todo dado vem de fetch para a API do backend

Scripts (`package.json`):
| Script | Comando | Uso |
|---|---|---|
| `npm run dev` | `next dev` | servidor de desenvolvimento |
| `npm run build` | `next build` | build de produção (valida tipos + lint) |
| `npm run typecheck` | `tsc --noEmit` | checagem de tipos isolada |
| `npm run lint` | `next lint` | ESLint (`next/core-web-vitals`) |
| `npm test` | `node --test tests/*.test.mjs` | testes de contrato (ver seção 9) |
| `npm start` | `next start` | servidor de produção |

## 3. Como o frontend fala com o backend

Ver `src/services/public/apiClient.ts` e `next.config.mjs`.

- O código **nunca** chama `NEXT_PUBLIC_API_URL` diretamente no cliente. Todas as chamadas usam **path relativo** (`/api/...`) na própria origem do site.
- `next.config.mjs` faz `rewrites()` de `/api/:path*` → `${NEXT_PUBLIC_API_URL}/api/:path*`. Isso é deliberado: mantém os cookies de sessão **first-party** mesmo em produção (login funciona via cookie, não via Bearer token).
- `publicApiGet/Post/Patch` (em `apiClient.ts`) sempre mandam `credentials: 'include'` e traduzem erros HTTP em mensagens amigáveis em PT-BR para os status 401/404/409/422/429/503 (`ApiError`).
- Única exceção: `src/services/account/cepService.ts` chama `https://viacep.com.br/ws/{cep}/json/` diretamente (API pública de terceiros, não é o backend do grupo).

**Documentação do contrato da API**: `public/docs/openapi.yaml` (OpenAPI 3.0) + Swagger UI estático em `public/docs/index.html`, acessível em `/docs/index.html` quando o site está rodando (fica fora de `src/` porque `public/` é servido como arquivo estático pelo Next.js e não pode ficar dentro de `src/`). Essa spec foi **reconstruída a partir do consumo do frontend** (não gerada do código do backend, que não está neste repo) — é a fonte de verdade de "o que o frontend espera da API". Ao adicionar/alterar uma chamada em `src/services/public/**` ou `src/services/account/**`, atualize também essa spec.

## 4. Estrutura de pastas

O código-fonte vive todo em `src/` (padrão `create-next-app` com `--src-dir`). `public/`, `tests/` e os arquivos de configuração ficam no root porque o Next.js e o Node exigem isso.

```
src/
  app/                         # Next.js App Router — cada pasta = rota
    bilheteria/
      page.tsx                 # /bilheteria — listagem com busca e filtro de tipo
      eventos/[slug]/
        page.tsx                # gera <head> via generateMetadata (fetch direto na API, server-side)
        EventDetailsPage.tsx    # client component com a página de detalhe + compra
    blog/
      page.tsx                 # /blog — lista de álbuns de formatura
      [slug]/page.tsx          # /blog/:slug — galeria de fotos do álbum
    carrinho/page.tsx
    checkout/
      page.tsx                 # fluxo de checkout (perfil + validação + confirmação)
      sucesso/page.tsx         # alias -> components/checkout/CheckoutStatusPage
      cancelado/page.tsx       # alias -> components/checkout/CheckoutStatusPage
    pagamento/
      sucesso/page.tsx         # alias -> src/app/checkout/sucesso (ver nota abaixo)
      cancelado/page.tsx       # alias -> src/app/checkout/cancelado
    minha-conta/
      page.tsx                 # dashboard da conta
      perfil/page.tsx          # dados pessoais + endereço (ProfileForm)
      pedidos/page.tsx         # lista de pedidos
      pedidos/[id]/page.tsx    # detalhe de um pedido
      ingressos/page.tsx       # ingressos com QR code
      inscricoes/page.tsx      # inscrições em cursos
    cadastro/page.tsx          # criação de conta (nome, CPF, CEP, endereço, senha)
    login/page.tsx             # login por e-mail/senha ou Google
    curso/page.tsx             # página institucional do curso + turmas abertas
    sobre/page.tsx              # história do grupo, professores, curso, formatura
    page.tsx                   # home institucional
    layout.tsx                 # <html><body><Providers> raiz, metadata global
    loading.tsx                # tela de loading global (App Router)
    globals.css

  components/
    layout/        # Header (institucional + ticketing variant), Footer, SocialFloat
    ui/             # peças de UI reutilizáveis sem estado de domínio:
                    #   EventCard, TicketQrCode, AutoCarousel, Motion, VideoBackground, PublicDataState
    catalog/        # consumo do catálogo público (eventos/álbuns/turmas/empresas):
                    #   PublicEventsCarousel, PublicAlbumsCarousel, PublicClassesSection,
                    #   PublicCompaniesCarousel, AlbumGallery
    account/        # área logada do cliente:
                    #   AccountShell (layout com sidebar + guard de auth), AccountLists
                    #   (Orders/Tickets/Enrollments), ProfileForm, OrderDetails
    checkout/       # CheckoutStatusPage (tela compartilhada de sucesso/cancelado/retorno Stripe)
    providers/      # AuthProvider, CartProvider, Providers (composição raiz)
    promotional-cta/# sistema de pop-up promocional com regras de frequência (ver seção 8)

  services/
    public/         # catálogo público, sem autenticação:
                    #   apiClient (fetch wrapper + ApiError), mappers (tolerante a shape PT/EN),
                    #   types, ticketService, publicEventService, publicClassService,
                    #   publicAlbumService, publicCompanyService
    account/        # autenticado / dados do cliente:
                    #   authService (sessão, login, cadastro, Google), meService (perfil,
                    #   validação de carrinho, checkout, pedidos, ingressos, inscrições),
                    #   cepService (ViaCEP)
    checkout/
      checkoutRecovery.ts  # persiste o orderId do último checkout em localStorage

  utils/
    publicFormatters.ts   # formatação de data/hora/moeda em pt-BR (fuso UTC fixo)

tests/
  payment-contract.test.mjs  # testes de contrato do fluxo de pagamento (ver seção 9).
                              # Lê arquivos de src/ por path literal — ver seção 9.

public/
  assets/, videos/      # imagens e vídeos de fundo
  docs/
    openapi.yaml        # contrato da API consumida (ver seção 3)
    index.html          # Swagger UI estático (CDN swagger-ui-dist, sem dependência npm)
```

**Alias `@/*`**: `tsconfig.json` mapeia `@/*` para `./src/*`. Todo import `@/components/...`, `@/services/...`, `@/utils/...` resolve dentro de `src/`. Ao criar um arquivo novo, ele deve nascer em `src/` — nunca recrie `app/`, `components/`, `services/` ou `utils/` no root.

**Nota sobre `src/app/pagamento/**`**: são aliases que reexportam `src/app/checkout/sucesso` e `src/app/checkout/cancelado` (`export { default } from '@/app/checkout/sucesso/page'`). Existem porque o Stripe/backend pode redirecionar para `/pagamento/sucesso` ou `/checkout/sucesso` dependendo da configuração — ambas as rotas levam à mesma tela (`CheckoutStatusPage`).

**Não existe `pages/`**: havia um `pages/_document.tsx` órfão (resquício de migração do Pages Router) sem nenhuma outra rota em `pages/`, portanto nunca era executado. Foi removido. Todo o roteamento é App Router (`src/app/`).

## 5. Design system / convenções de UI

- Paleta em `tailwind.config.ts` sob o namespace `gaucho`: `gaucho-green` (#005b25), `gaucho-dark`, `gaucho-red` (#cf1616), `gaucho-gold` (#f6c545), `gaucho-cream` (#fff8ec). Use esses tokens em vez de cores Tailwind genéricas para qualquer elemento de marca.
- Fontes: `font-display` (Georgia/serif, usada em títulos `h1`/`h2`) e `font-sans` (Inter, corpo).
- **Duas variantes de `Header`** (`src/components/layout/Header.tsx`): `institutional` (menu Home/Sobre/Blog/Contato) e `ticketing` (voltar à home + carrinho + menu de conta). A variante é inferida automaticamente pela rota (`variantForPath`) com base numa lista de rotas de bilheteria — só passe `variant` explicitamente em casos excepcionais.
- Componentes são deliberadamente **compactos e sem comentários** (muita JSX inline por linha, estilo condensado). Siga o estilo existente ao editar um arquivo em vez de expandir tudo em JSX multilinha — este projeto prioriza arquivos curtos.
- Não há Storybook, design tokens em JSON, nem CSS Modules — tudo é Tailwind utility classes + os tokens do `tailwind.config.ts`.
- Textos de UI são **sempre em português do Brasil**, incluindo mensagens de erro e labels de formulário.

## 6. Autenticação e sessão

- `src/components/providers/AuthProvider.tsx`: contexto React com `user`, `loading`, `signIn`, `signUp`, `signOut`, `refresh`. Carrega a sessão em `useEffect` via `authService.getSession()` (`GET /api/auth/get-session`).
- Login por e-mail/senha (`POST /api/auth/sign-in/email`) ou Google OAuth (`POST /api/auth/sign-in/social` → redireciona para `response.url`).
- Cadastro (`POST /api/customer-auth/sign-up`) pede nome, e-mail, CPF, telefone, CEP, endereço (rua) e senha — data de nascimento, gênero e os detalhes do endereço (número, complemento, bairro, estado, cidade) são preenchidos depois em `/minha-conta/perfil` (`ProfileForm`), que é **pré-requisito para finalizar checkout** (`hasCompleteProfile` em `src/app/checkout/page.tsx`).
- Páginas protegidas (`AccountShell`, `src/app/checkout/page.tsx`) redirecionam para `/login?returnTo=<rota>` quando `!loading && !user`. Sempre preserve esse padrão `returnTo` ao criar novas rotas protegidas.
- O backend usa um padrão compatível com better-auth (rotas `/api/auth/*` e cookie de sessão) — ver `cookieAuth` no OpenAPI spec.

## 7. Carrinho e checkout (fluxo crítico de negócio)

Este é o fluxo mais sensível do projeto — qualquer alteração aqui deve respeitar os testes de `tests/payment-contract.test.mjs` (seção 9). Resumo end-to-end:

1. **Carrinho** (`src/components/providers/CartProvider.tsx`): estado 100% client-side, persistido em `localStorage` (`cg_cart_v1`). Guarda só `eventId`, `quantity` e um snapshot leve do evento (título, tipo, imagem, preço, data, cidade, local) — **nunca** é a fonte de verdade de preço/disponibilidade.
2. **Página `/checkout`** (`src/app/checkout/page.tsx`): ao entrar, chama em paralelo `meService.profile()` e `meService.validateCart(cart.items)` (`POST /api/me/checkout/validate`). O backend recalcula preço, disponibilidade e quantidade reais — se algo mudou (`validation.changed`), o usuário precisa confirmar explicitamente antes de continuar.
3. **Confirmar pedido**: `meService.checkout(cart.items)` → `POST /api/payments/checkout` com `{ items, origin: 'SITE' }`. **O frontend nunca envia preço/subtotal/total nessa chamada** — isso é deliberado e testado (`tests/payment-contract.test.mjs`, teste 1). O backend sempre recalcula.
4. `rememberCheckoutOrder(orderId)` (salva em `localStorage`) é chamado **antes** de redirecionar para `checkoutUrl` (Stripe) — para que a volta do Stripe (sucesso, cancelado, ou fechar a aba e voltar depois) consiga retomar o status do pedido. Se o evento é gratuito e `status === 'PAGO'` de cara, não há redirect para Stripe: o carrinho é limpo e o usuário vai direto para `/checkout/sucesso`.
5. **Retorno do Stripe**: `src/components/checkout/CheckoutStatusPage.tsx` lê o `orderId` salvo (`recoverCheckoutOrder`) e faz polling em `GET /api/payments/{orderId}/status` a cada 2s, até 15 tentativas. Estados terminais: `PAGO` (limpa o `orderId` salvo, libera ingressos), `FALHOU`/`CANCELADO`/`EXPIRADO` (permite retry via `POST /api/payments/{orderId}/retry`), `ESTORNADO`/`PARCIALMENTE_ESTORNADO`/`CONTESTADO`/`CONTESTACAO_PERDIDA` (estados informativos).
6. **Página `/checkout/cancelado`** (retorno direto do Stripe com `?orderId=`): **não cancela nem altera o pedido** — é só uma tela de "não concluído" com opção de tentar novamente. O cancelamento real de pedido não existe no fluxo atual.
7. Perfil incompleto durante o checkout → backend responde **422** → frontend redireciona para `/minha-conta/perfil?returnTo=/checkout&incompleto=1` em vez de mostrar erro genérico.

Enum de status de pagamento (`PaymentStatus.paymentStatus`): `PENDENTE | PROCESSANDO | PAGO | FALHOU | CANCELADO | EXPIRADO | ESTORNADO | PARCIALMENTE_ESTORNADO | CONTESTADO | CONTESTACAO_PERDIDA`.

## 8. Sistema de CTA promocional (pop-up)

`src/components/promotional-cta/` implementa um pop-up promocional com regras de frequência para evitar ser intrusivo:

- Definições de conteúdo em `promotionalCtaDefinitions.ts` (5 CTAs: bilheteria online, turmas disponíveis, próximos eventos, álbuns de formatura, redes sociais), cada um com `priority` (usado para desempate).
- `PromotionalCtaProvider.tsx` só "arma" o pop-up depois de 25s na página **ou** 35% de scroll, e nunca em rotas de conversão (`/checkout`, `/login`, `/cadastro`, `/minha-conta/**`, `/pedido*`) nem quando há outro modal/menu aberto ou um input focado.
- Limites: no máximo 2 exibições por sessão (`sessionStorage`), e cada CTA individual só reaparece após 24h (`localStorage`, por `id`).
- Ao editar essas regras, preserve os `data-*`/`role="dialog"` e o foco trap de `PromotionalCtaModal.tsx` (acessibilidade: Tab cycling, Escape, restauração de foco).

## 9. Testes

`tests/payment-contract.test.mjs` não é um teste de unidade tradicional — ele faz **análise estática por regex sobre o código-fonte** (lê os arquivos com `readFileSync` e usa `assert.match`) para travar invariantes do fluxo de pagamento que são fáceis de violar sem querer num refactor, por exemplo:
- o checkout usa a rota canônica `/api/payments/checkout` e manda só `items`/`origin` (nunca valores calculados no cliente);
- `rememberCheckoutOrder` é chamado **antes** do `window.location.assign` do Stripe;
- o polling de status é limitado (`attempts < 15`) e só libera ingressos quando `PAGO`;
- a tela de cancelado nunca manda um "cancelar pedido" para o backend.

**Se você mover ou renomear** `src/services/account/meService.ts`, `src/app/checkout/page.tsx`, `src/components/checkout/CheckoutStatusPage.tsx` ou `src/app/checkout/cancelado/page.tsx`, atualize os paths lidos no topo de `tests/payment-contract.test.mjs` — eles são caminhos de arquivo literais (`new URL('../src/...', import.meta.url)`), não imports resolvidos pelo TypeScript/alias `@/*`.

Rode com `npm test`. Não há testes de componente/E2E neste projeto — `npm run typecheck` + `npm run lint` + `npm run build` são a rede de segurança para o resto.

## 10. Variáveis de ambiente

| Variável | Uso | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | origem do backend, usada só em `next.config.mjs` (rewrites) e em `generateMetadata` server-side de `src/app/bilheteria/eventos/[slug]/page.tsx` | `http://localhost:3333` |

Ver `.env.example`. Imagens remotas: `next.config.mjs` permite apenas `res.cloudinary.com` via `images.remotePatterns` — álbuns/fotos vêm do Cloudinary através do backend.

## 11. Pontos de atenção / dívida técnica conhecida

- `tailwind.config.ts` inclui `./src/data/**/*.{js,ts}` no `content`, mas não existe pasta `src/data/` no projeto — glob morto, inofensivo, mas pode ser removido no futuro.
- Os mappers em `src/services/public/mappers.ts` são tolerantes a múltiplas variantes de nome de campo (PT/EN) vindas do backend (`title ?? titulo ?? name ?? nome`, etc.) — isso é proposital porque o backend evoluiu o contrato ao longo do tempo. Ao adicionar um campo novo, siga esse padrão de fallback em vez de assumir um único nome de campo.
- `src/services/account/meService.ts` tem vários tipos `Record<string, unknown>` (ex. `CustomerOrder.items`, tickets, enrollments) — o backend não tem contrato 100% tipado para esses payloads ainda. Não force tipagem forte sem confirmar o shape real.
- Não existe camada de cache/SWR/React Query — cada componente busca com `useEffect` + `useState` próprio. É um padrão consistente no projeto; não introduza uma lib de data-fetching sem alinhar antes, pois afetaria todos os componentes de `catalog/` e `account/`.
- O backend às vezes retorna URLs de imagem do Cloudinary em `http://` em vez de `https://` (confirmado em produção via `res.cloudinary.com`). `next.config.mjs` libera os dois protocolos para esse host em `images.remotePatterns` — se aparecer um novo erro "hostname is not configured" do `next/image`, confira o protocolo da URL antes de assumir que é só o hostname que falta.

## 12. Documentação e automação complementar

- `public/docs/openapi.yaml` + `public/docs/index.html` — contrato da API (Swagger UI), ver seção 3.
- `.claude/agents/checkout-payments-guardian.md` — subagente especializado em revisar mudanças no fluxo de pagamento/checkout.
- `.claude/agents/catalog-api-sync.md` — subagente especializado em manter `src/services/public/**`, `src/services/account/**` e o OpenAPI spec sincronizados quando o contrato do backend mudar.
- `.claude/skills/` — skills de projeto (invocáveis com `/nome-da-skill`) para fluxos recorrentes deste repositório: ver `.claude/skills/*/SKILL.md`.
