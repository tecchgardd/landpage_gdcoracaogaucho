# Contrato frontend → backend (Coração Gaúcho)

Status: **v1 — 31/10/2026**. Este documento lista tudo o que o site (`landpage_gdcoracaogaucho`) espera do backend (`backend_coracaogaucho`) para funcionar em produção com muito tráfego. Os payloads detalhados estão em `public/docs/openapi.yaml` (Swagger em `/docs/index.html`). A visão de produto e os modelos novos estão em `docs/ARQUITETURA.md`.

O frontend **não tem mais modo local**: sem o backend, não há catálogo, login nem compra.

---

## 1. Como o tráfego chega ao backend

```
Navegador ──► site (Vercel/CDN) ──► servidor do Next ──► balanceador ──► N instâncias do backend
                 │                      │                                   │
                 │ cache CDN            ├─ /api/public/**  → cache de leitura (60s, tags)
                 │ (s-maxage)           └─ /api/**         → BFF com lista fechada
                                                                            ├─ Postgres (primário: escrita)
                                                                            ├─ Postgres (réplica: leitura)
                                                                            ├─ Redis (rate limit, idempotência, locks)
                                                                            └─ Fila (webhooks, e-mails, revalidação)
```

- O navegador **só** chama a origem do site. Nada no cliente conhece a URL do backend.
- `src/app/api/public/[...path]/route.ts`: GETs do catálogo passam por cache (60s). Com o cache vazio, requisições iguais e simultâneas viram **uma** chamada ao backend por instância do Next. Respostas 200 e 404 entram no cache; erros (5xx, timeout) nunca, e se o backend cair continua valendo a última resposta boa. A CDN recebe `Cache-Control: public, max-age=15, s-maxage=60, stale-while-revalidate=300`.
- `src/app/api/[...path]/route.ts` (BFF): repassa **apenas** as rotas da seção 4. Qualquer outra rota do backend (admin, internas) responde 404 pelo site. Escritas vindas de outra origem respondem 403 (CSRF), exceto `auth/callback/*`. O corpo é limitado a 64 KB e o timeout é de 20s.
- Cabeçalhos que o BFF envia ao backend: `cookie`, `content-type`, `accept`, `accept-language`, `user-agent`, `origin`, `referer`, `idempotency-key`, `x-forwarded-for` (IP real do cliente), `x-forwarded-host`, `x-forwarded-proto` e, se configurado, `x-bff-key`.
- Do backend o BFF devolve todos os `Set-Cookie` e o status, inclusive 302 para OAuth. Força `Cache-Control: no-store`.

### Variáveis do lado do site
| Variável | Para quê |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL pública do backend (fallback) |
| `API_INTERNAL_URL` | URL do balanceador/rede interna, usada só pelo servidor do Next |
| `REVALIDATE_SECRET` | segredo do `POST /api/revalidate` (seção 6) |
| `BACKEND_SHARED_SECRET` | enviado como `x-bff-key` em toda chamada do servidor do Next |

## 2. Requisitos gerais do backend

1. **Instâncias stateless** atrás de balanceador (round-robin ou menor número de conexões). Nada de estado em memória que precise sobreviver entre requisições: sessão, rate limit, idempotência e locks ficam em Postgres/Redis.
2. **Confiar no proxy**: ler o IP do cliente de `X-Forwarded-For` **somente** quando vier com `x-bff-key` válido (`app.set('trust proxy', …)` no Express + middleware que confere o segredo). Com `BACKEND_SHARED_SECRET` definido, recusar com 403 o que não vier do site, exceto webhooks e o painel admin.
3. **better-auth**: `trustedOrigins` deve conter o domínio do site (o BFF repassa o `Origin` original). Cookie de sessão `__Secure-cg-admin.session_token` com `HttpOnly; Secure; SameSite=Lax; Path=/`. Renovar a sessão periodicamente e invalidar todas as sessões ao trocar a senha.
4. **Erros** sempre em JSON `{ message, code?, details? }`, com mensagem em PT-BR. O site mostra `message` quando vem `code`; senão, usa textos próprios para 401/404/409/422/429/503.
5. **429 com `Retry-After`** (em segundos). O cliente repete GETs com espera exponencial e jitter, até 2 vezes, respeitando `Retry-After`; escritas não são repetidas automaticamente.
6. **Pool de conexões**: PgBouncer (modo transação) ou o pool do Prisma dimensionado para `instâncias × conexões ≤ max_connections`. Em serverless, use o Prisma Accelerate ou um pooler.
7. **Timeouts**: responder em menos de 20s (limite do BFF). Trabalho lento, como e-mail, PDF ou nota fiscal, vai para a fila.

## 3. CQRS: separar leitura de escrita

O tráfego tem dois perfis bem diferentes: muita gente **olhando** o catálogo (barato, cacheável) e picos de **compra** na abertura de vendas (caro, precisa de consistência).

### 3.1 Lado de leitura (catálogo)
- Rotas `GET /api/public/*` leem da **réplica** do Postgres, ou de views/tabelas desnormalizadas: `vw_catalogo_eventos` já com o menor preço, o status do lote e o `soldOut` calculados.
- Respostas idempotentes e cacheáveis: o backend pode enviar `Cache-Control: public, s-maxage=30` e `ETag`.
- Disponibilidade no catálogo é **indicativa**. A verdade é sempre o checkout (seção 3.2), por isso 60s de cache são aceitáveis.
- Após qualquer escrita que mude o catálogo, o backend publica um evento e um worker chama `POST {site}/api/revalidate` (seção 6). Use **outbox** (tabela `OutboxEvent` gravada na mesma transação) para não perder invalidações.

### 3.2 Lado de escrita (pedido e pagamento)
- `POST /api/payments/checkout` e `POST /api/payments/{id}/retry` exigem **`Idempotency-Key`** (UUID; o site gera um por tentativa):
  - guardar a chave + `userId` → `{ status, resposta }` por 24h (Redis ou tabela com índice único);
  - mesma chave e mesmo corpo → devolver a **mesma** resposta, sem criar outro pedido;
  - mesma chave com corpo diferente → 422;
  - mesma chave ainda em processamento → 409 (`code: IDEMPOTENCY_IN_PROGRESS`).
- **Reserva de estoque/lote atômica**, sem ler e depois gravar:
  ```sql
  UPDATE "Lote" SET vendidos = vendidos + :qtd
  WHERE id = :id AND vendidos + :qtd <= capacidade
  RETURNING id;   -- 0 linhas = esgotado → 409
  ```
  O mesmo vale para `ProdutoVariante.estoque` e vagas de turma. Tudo na mesma transação que cria o `Pedido`.
- A reserva expira junto com a sessão de pagamento (ex.: 30 min). Pagamento `EXPIRADO`/`CANCELADO`/`FALHOU` devolve as unidades (job agendado + webhook).
- **Webhooks** do gateway (Stripe/Asaas): validar assinatura, gravar o evento com o id do provedor como chave única (`PaymentWebhookEvent`), responder 200 rápido e processar na fila. A confirmação libera ingresso/acesso ao curso uma única vez.
- **Limites por conta**: até 20 unidades por linha (o site já limita), cursos online e turmas com quantidade 1, e limite configurável de ingressos por CPF por evento contra cambistas.
- **Rate limit** (Redis, janela deslizante): por IP em `sign-in`, `sign-up` e `checkout`; por usuário em `checkout` e `retry`.
- **Fila virtual (opcional)** para aberturas de venda muito grandes: o checkout devolve 429 + `Retry-After`, e o site já trata isso.

## 4. Rotas que o site usa (lista do BFF)

Tudo abaixo é chamado em `/api/...` na origem do site e repassado igual ao backend. Detalhes de payload: `openapi.yaml`.

| Método | Rota | Situação |
|---|---|---|
| GET | `/api/public/events`, `/events/{idOrSlug}`, `/albums`, `/albums/{slug}`, `/albums/{slug}/photos`, `/empresas` | existe |
| GET | `/api/public/products`, `/products/{slug}`, `/courses`, `/courses/{slug}` | **novo** |
| GET | `/api/auth/get-session` | existe |
| POST | `/api/auth/sign-in/email`, `/api/auth/sign-out`, `/api/customer-auth/sign-up` | existe |
| POST | `/api/auth/sign-in/social` com `provider`: `google` \| `apple` \| `facebook` \| `microsoft` | **ampliar** (hoje só Google) |
| GET/POST | `/api/auth/callback/{provider}` (a Apple usa `form_post`) | ampliar |
| GET/PATCH | `/api/me/profile` | existe |
| POST | `/api/me/checkout/validate` | existe (aceitar `productId`/`courseId`) |
| POST | `/api/payments/checkout` (+ `Idempotency-Key`) | existe → **exigir idempotência** |
| GET | `/api/payments/{orderId}/status` | existe |
| POST | `/api/payments/{orderId}/retry` (+ `Idempotency-Key`) | existe → **exigir idempotência** |
| GET | `/api/me/orders`, `/api/me/orders/{id}`, `/api/me/tickets`, `/api/me/enrollments` | existe |
| GET/DELETE | `/api/cart` | **novo** (seção 5) |
| POST | `/api/cart/items` | **novo** |
| PATCH/DELETE | `/api/cart/items/{key}` | **novo** |
| GET | `/api/me/courses`, `/api/me/courses/{slug}` | **novo** |
| POST | `/api/me/courses/redeem`, `/api/me/courses/{courseId}/sessions` | **novo** |
| POST | `/api/me/course-sessions/{id}/heartbeat`, `/api/me/course-sessions/{id}/end` | **novo** |
| DELETE | `/api/me/course-sessions/{id}` | **novo** |
| GET | `/api/me/lessons/{id}/playback?sessionId=` | **novo** |
| POST | `/api/me/lessons/{id}/progress` | **novo** |
| GET | `/api/me/devices` · DELETE `/api/me/devices/{id}` | **novo** |
| POST | `/api/consents` | **novo** (seção 7) |

Para expor uma rota nova ao site, inclua-a em `ALLOWED` no BFF (`src/app/api/[...path]/route.ts`) e na spec.

## 5. Carrinho no servidor

O site não guarda mais o carrinho no navegador.

- **Visitante**: o backend cria o cookie `cg_cart` (UUID aleatório, `HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=30 dias`) no primeiro `GET /api/cart` ou `POST /api/cart/items`.
- **Logado**: carrinho ligado ao `customerId`. **No login** (hook do better-auth), mesclar o carrinho do visitante no da conta: somar as quantidades respeitando os limites, manter os cursos com quantidade 1, apagar o carrinho do visitante e o cookie.
- Todas as rotas respondem o **carrinho inteiro** (`Cart { items: CartLine[] }`). O site aplica a mudança na hora e depois substitui pelo que veio do servidor.
- `POST /api/cart/items` é **upsert**: `quantity` substitui, não soma. A chave é `EVENT:<id>`, `PRODUCT:<id>:<variantId|u>` ou `COURSE:<id>`.
- `CartLine.unitPrice` é uma prévia: o valor final é sempre recalculado no checkout. Item esgotado retorna 409.
- Após um pedido `PAGO`, o backend esvazia o carrinho da conta. O site também chama `DELETE /api/cart` no checkout gratuito.
- `POST /api/payments/checkout` continua recebendo `items` (contrato e testes atuais). O backend pode validar contra o carrinho do servidor.
- Carrinhos abandonados (sem alteração há mais de 30 dias) podem ser apagados por job.

## 6. Invalidação do cache do catálogo

O site expõe `POST {site}/api/revalidate` com o header `x-revalidate-secret: <REVALIDATE_SECRET>` e o corpo `{ "tags": ["catalog:events"] }`.

| Tag | Quando chamar |
|---|---|
| `catalog` | invalida tudo |
| `catalog:events` | evento, lote, preço ou esgotado alterado (inclui turmas, que são eventos `CURSO`) |
| `catalog:products` | produto, variante ou estoque |
| `catalog:courses` | curso online, módulo ou aula |
| `catalog:albums` | álbum ou foto |
| `catalog:empresas` | patrocinadores |

Chamar a partir do worker do outbox, com retry. Sem a chamada, o cache se atualiza sozinho em até 60s.

## 7. Cookies e LGPD

### Cookies que o backend cria (todos `HttpOnly; Secure; SameSite=Lax; Path=/`)
| Cookie | Uso | Duração |
|---|---|---|
| `__Secure-cg-admin.session_token` | sessão | definida pelo better-auth |
| `cg_cart` | carrinho do visitante | 30 dias |
| `cg_device` | aparelho nas aulas (limite de aparelhos) | 1 ano |

Os nomes e durações aparecem na página pública `/cookies`; se mudarem no backend, avise para atualizar a página.

### Cookies criados pelo próprio site (lidos no navegador)
`cg_consent` (escolha de cookies, 12 meses), `cg_checkout_order` (último pedido, 2 dias), `cg_cta` (pop-ups vistos, 30 dias, só com consentimento de preferências).

### O que o backend precisa ter
- `POST /api/consents { version, preferences, media }`: gravar com data/hora, IP, user-agent e `userId` (se logado). É a prova de consentimento (LGPD art. 8º §2º).
- Registros de acesso (IP, data e hora) guardados por **6 meses** (Marco Civil, art. 15).
- Senhas com hash forte (o better-auth já usa scrypt).
- Planejar endpoints de direitos do titular (art. 18): exportar dados da conta e pedir exclusão/anonimização. Pedidos com obrigação fiscal são anonimizados, não apagados.
- Enviar ao front os dados do controlador e do encarregado (razão social, CNPJ, endereço, e-mail do DPO), hoje marcados como `[PREENCHER]` em `/privacidade`, `/termos` e `/cookies`.

## 8. Aparelhos das aulas (mudança de contrato)

- `POST /api/me/courses/{courseId}/sessions` agora recebe só `{ deviceName }`. O backend lê o cookie `cg_device` (ou o cria), usa-o como `Dispositivo.id` e responde `{ sessionId, heartbeatSeconds }`.
- `GET /api/me/devices` marca `current: true` no aparelho cujo id é igual ao cookie da requisição.
- O `sessionId` é opaco para o site e pode conter `:` (o BFF aceita `[\w:%.-]`).

## 9. Checklist para o backend

- [ ] Instâncias stateless + balanceador; Redis para rate limit, idempotência e locks
- [ ] Réplica de leitura para `/api/public/*` e views desnormalizadas do catálogo
- [ ] `Idempotency-Key` em checkout e retry
- [ ] Reserva atômica de lote/estoque/vagas com expiração
- [ ] Webhooks idempotentes processados em fila
- [ ] Outbox + chamada a `POST /api/revalidate` do site
- [ ] Carrinho no servidor (`/api/cart*`) com cookie `cg_cart` e mescla no login
- [ ] Login social com Apple, Facebook e Microsoft além do Google
- [ ] Cookie `cg_device` e novo body de sessões de curso
- [ ] `POST /api/consents` e logs de acesso por 6 meses
- [ ] 429 com `Retry-After`; erros JSON em PT-BR
- [ ] `trust proxy` + validação de `x-bff-key`; `trustedOrigins` com o domínio do site
- [ ] Desligar a Vercel Authentication do deploy de produção do backend (hoje responde 302 para tudo)
