---
name: nova-pagina-conta
description: >
  Cria uma nova página protegida dentro de /minha-conta (ex. favoritos,
  endereços salvos, notificações) seguindo o padrão AccountShell já usado por
  pedidos/perfil/ingressos/inscrições neste projeto (coracao-gaucho-next). Use
  quando o usuário pedir uma nova seção da área logada do cliente.
---

# Nova página em /minha-conta

Este projeto tem um padrão fixo para páginas protegidas da conta do cliente —
siga-o em vez de inventar um layout novo. Referências a ler primeiro:
`src/components/account/AccountShell.tsx`, e um exemplo simples completo:
`src/app/minha-conta/pedidos/page.tsx` + `src/components/account/AccountLists.tsx`.

## Passo a passo

1. **Rota**: crie `src/app/minha-conta/<nome-da-secao>/page.tsx`. O arquivo é
   um Server Component simples que só compõe `AccountShell` com o título da
   página e delega o conteúdo a um componente client:

   ```tsx
   import { AccountShell } from '@/components/account/AccountShell';
   import { MinhaNovaLista } from '@/components/account/MinhaNovaLista';
   export default function Page() {
     return <AccountShell title="Título da seção"><MinhaNovaLista /></AccountShell>;
   }
   ```

   `AccountShell` já cuida do guard de autenticação (redireciona para
   `/login?returnTo=<rota atual>` se `!loading && !user`) e do layout com
   sidebar — não duplique essa lógica na nova página.

2. **Componente de conteúdo**: crie em `src/components/account/`, com
   `'use client'`, seguindo o padrão de `OrdersList`/`TicketsList`/
   `EnrollmentsList` em `src/components/account/AccountLists.tsx`: estado
   `{ data: T | null; error: string }`, busca em `useEffect`, três estados de
   retorno (`Loading`, `ErrorState`, lista real) — reuse esses helpers de UI
   em vez de recriar skeletons/estados de erro do zero.

3. **Dados**: se a seção precisa de um endpoint novo, adicione o método em
   `src/services/account/meService.ts` (siga o padrão: `publicApiGet<...>(path)`
   com tipo de retorno explícito) e documente o endpoint em
   `public/docs/openapi.yaml` (ver skill/agente de sincronização da API —
   `.claude/agents/catalog-api-sync.md`).

4. **Link na sidebar**: se a seção deve aparecer na navegação lateral da
   conta, adicione em `const links = [...]` dentro de
   `src/components/account/AccountShell.tsx`.

5. Depois de criar tudo, rode a skill `validar-build` (ou `npm run typecheck`
   no mínimo) para confirmar que a nova rota compila e não quebrou nada.

Mantenha o mesmo estilo condensado do restante do projeto (ver `CLAUDE.md`
seção 5) — este projeto não usa comentários decorativos nem quebra JSX em
excesso de linhas.
