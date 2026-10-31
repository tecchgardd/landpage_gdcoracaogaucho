# Arquitetura — Coração Gaúcho (site + loja + área do aluno)

Status: **rascunho v2 (31/10/2026)**. O frontend consome só a API real (o modo local com `localStorage` foi removido). O que o backend precisa entregar, inclusive escala, cache, cookies e LGPD, está em **`docs/CONTRATO_BACKEND.md`**.

## 1. Os três sistemas

| Sistema | Repositório | Quem usa | Stack |
|---|---|---|---|
| **Site do cliente** (este repo) | `landpage_gdcoracaogaucho` | público e alunos | Next.js 14 |
| **Painel admin** | `painel_adm_gdcoracaogaucho` | equipe do grupo | Expo / React Native (web + app) |
| **Backend** | `backend_coracaogaucho` | os dois acima + n8n | Express + Prisma + PostgreSQL + better-auth |

O site do cliente tem três "portas", todas com **um único login** (better-auth, cookie first-party; o navegador só chama `/api/*` do próprio site e o servidor do Next faz cache de leitura + BFF para o backend):

1. **Site institucional** — `/`, `/sobre`, `/curso`, `/blog`. Conta a história e converte para as outras duas portas.
2. **Loja** — `/loja` (vitrine com categorias: bailes e eventos, cursos presenciais, cursos online, produtos), `/loja/eventos/[slug]`, `/loja/produtos/[slug]`, `/loja/cursos/[slug]`, `/carrinho`, `/checkout`. Substitui a antiga `/bilheteria` (redirect 301 em `next.config.mjs`).
3. **Área do aluno** — `/minha-conta/**` (pedidos, ingressos, turmas, **meus cursos**, **dispositivos**, dados) e a sala de aula `/aulas/[curso]`.

### Decisão: um painel só para o cliente
Optamos por **uma única área logada** (`/minha-conta`) com a sala de aula como tela imersiva separada (`/aulas/[curso]`), em vez de um portal de cursos à parte. Motivos: um login, um carrinho e um histórico de pedidos para tudo; o cliente que compra ingresso já vê o curso online como próximo passo; e o limite de aparelhos só precisa existir na sala de aula. Se no futuro o curso virar produto independente (outros grupos vendendo), a sala de aula pode ser extraída para um subdomínio sem mudar o backend.

Rotas protegidas: `src/middleware.ts` barra `/minha-conta/**`, `/aulas/**` e `/checkout` sem o cookie `cg-admin.session_token` (redirect para `/login?returnTo=`), e os componentes continuam validando a sessão real no backend.

## 2. O que o backend precisa ganhar

Hoje o banco conhece **eventos** (`Evento` com tipo BAILE/CURSO/EVENTO), `Pedido`/`PedidoItem`, `Ingresso`, `Inscricao`, `Pagamento` (Stripe). `PedidoItem.productId` já existe, mas não há tabela de produto. O contrato que o frontend consome está em `public/docs/openapi.yaml` (seção **PLANEJADO**).

### 2.1 Modelos novos (Prisma, sugestão)
```
Produto        id, slug, nome, descricao, categoria, imagens[], preco(centavos), precoDe, status
ProdutoVariante id, produtoId, rotulo (P/M/G), estoque, preco?
CursoOnline    id, slug, titulo, subtitulo, descricao, imagem, trailerUrl, nivel, preco, precoDe,
               diasAcesso (null = vitalício), maxDispositivos (default 2), status
CursoModulo    id, cursoId, titulo, ordem
CursoAula      id, moduloId, titulo, descricao, duracaoMin, ordem, gratuita,
               videoProvider, videoAssetId, materiais(Json)
AcessoCurso    id, customerId, cursoId, codigo (8 chars A-Z0-9, único), status ATIVO|EXPIRADO|REVOGADO,
               origem (COMPRA|CODIGO|CORTESIA), pedidoId?, inicioEm, expiraEm
ProgressoAula  acessoId, aulaId, segundos, concluidaEm   (@@id([acessoId, aulaId]))
Dispositivo    id (UUID do cookie httpOnly cg_device), customerId, nome, ultimoAcessoEm
SessaoCurso    id, acessoId, dispositivoId, iniciadaEm, ultimoHeartbeatEm, encerradaEm
```
`PedidoItem` ganha `courseId` e `variantId`; `PedidoType` ganha `ONLINE_COURSE` (ou usar STORE).

### 2.2 Fluxo de compra do curso online
1. Cliente adiciona o curso ao carrinho → `POST /api/payments/checkout` com `{ items: [{ courseId, quantity: 1 }], origin: 'SITE' }` (o frontend **nunca** manda preço).
2. Backend recalcula, cria o pedido e a cobrança no gateway, devolve `checkoutUrl`.
3. **Só o webhook** confirma o pagamento. Na confirmação, a mesma transação idempotente que hoje libera ingresso cria o `AcessoCurso` com um `codigo` único vinculado ao `customerId` — esse é o "token do curso".
4. Venda no balcão/presente: o admin gera um `AcessoCurso` sem dono; o cliente vincula em *Meus cursos › Tenho um código* (`POST /api/me/courses/redeem`).

### 2.3 Limite de aparelhos simultâneos (1 ou 2)
- O backend identifica o aparelho pelo cookie httpOnly `cg_device` (UUID, 1 ano), criado no primeiro `POST .../sessions`.
- Ao abrir a aula: `POST /api/me/courses/{courseId}/sessions { deviceName }`. Sessão **ativa** = heartbeat nos últimos 2 min. Se já houver `maxDispositivos` sessões ativas de outros aparelhos → **409 `DEVICE_LIMIT`** com a lista de aparelhos; o cliente escolhe qual encerrar (`DELETE /api/me/devices/{id}`).
- Heartbeat a cada 60 s; sessão revogada responde **409 `SESSION_REVOKED`** e o player para.
- `GET /api/me/lessons/{id}/playback?sessionId=` só entrega URL de vídeo **assinada e de curta duração** se a sessão estiver ativa. Sem isso, o limite seria só visual.
- O player já exibe marca d'água móvel com o e-mail do aluno e bloqueia download/PiP, para desencorajar gravação e compartilhamento.
- O limite é configurável por curso (`maxDispositivos`): 1 ou 2, como o cliente pediu.

### 2.4 Hospedagem dos vídeos
Recomendado: **Bunny Stream** (barato, HLS, URL assinada por token e expiração) ou **Cloudflare Stream**. O Cloudinary (já usado nas fotos) também assina vídeo, mas o custo por minuto entregue é maior. O frontend aceita `kind: mp4 | hls | embed`; para HLS em Chrome/Android será preciso adicionar `hls.js` ao player (Safari/iOS tocam nativo). O upload é feito pelo painel admin (tela nova: Cursos online › Módulos › Aulas).

### 2.5 Gateway: Stripe → Asaas
O cliente quer usar o **Asaas**, que cobra (Pix, boleto, cartão) e emite **nota fiscal de serviço** automaticamente.
- No backend, trocar a criação da Checkout Session do Stripe por: criar/atualizar o cliente no Asaas (`/v3/customers` com CPF/endereço do perfil), criar a cobrança (`/v3/payments` com `billingType: UNDEFINED` para o cliente escolher, ou um link de pagamento) e devolver `invoiceUrl` como `checkoutUrl`. **O contrato com o frontend não muda.**
- Webhook do Asaas (`PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`, `PAYMENT_OVERDUE`, `PAYMENT_REFUNDED`, `PAYMENT_CHARGEBACK_*`) mapeado para o enum interno `PagamentoStatus` (PAGO, EXPIRADO, ESTORNADO, CONTESTADO...). Validar pelo token do webhook, mantendo a idempotência atual (`PaymentWebhookEvent`).
- Nota fiscal: configurar a emissão automática no Asaas (`/v3/invoices` ou regra "emitir ao receber"), com o código de serviço municipal do grupo. Para **produtos físicos** (camiseta, boné) a nota é de mercadoria (NF-e), que o Asaas não emite: precisa confirmar com a contabilidade se o grupo vende como MEI/ME com outro emissor.
- O perfil completo (CPF + endereço) já é obrigatório antes do checkout, o que atende os dados exigidos para a nota.
- `PaymentProvider` ganha `ASAAS`; as colunas `stripe*` ficam como histórico.

## 3. Modo local (removido)

O modo `NEXT_PUBLIC_USE_MOCKS` (catálogo simulado, `localDb` em `localStorage`, admin de teste) foi **removido** em 31/10/2026: o site depende do backend real. Observação: em 31/10/2026 o deploy `backend-coracaogaucho.vercel.app` está atrás da **Vercel Authentication** (toda chamada volta 302/401); é preciso desligar a proteção do deploy de produção ou usar um domínio próprio para o site funcionar com dados reais.

## 4. Próximas fases sugeridas
1. **Backend — catálogo**: Produto/Variante e CursoOnline/Módulo/Aula + rotas públicas. Painel admin: telas de cadastro.
2. **Backend — Asaas**: cobrança, webhook e nota fiscal; aceitar `productId`/`courseId` no checkout.
3. **Backend — área do aluno**: AcessoCurso (gerado no webhook), sessões/aparelhos, playback assinado, progresso.
4. **Vídeos**: conta no Bunny/Cloudflare Stream, upload pelo painel, `hls.js` no player.
5. Conteúdo real: fotos e vídeos do grupo, textos da história e depoimentos (os atuais são provisórios).
