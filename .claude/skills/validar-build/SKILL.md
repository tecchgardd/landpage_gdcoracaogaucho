---
name: validar-build
description: >
  Roda a bateria completa de validação do coracao-gaucho-next (typecheck, lint,
  testes de contrato de pagamento e build de produção) e resume o resultado.
  Use antes de abrir um PR, depois de qualquer refactor/reorganização de
  arquivos, ou quando o usuário pedir para "validar o projeto", "checar se
  está tudo ok" ou "rodar os testes antes de commitar".
---

# Validar build

Checklist de validação deste projeto Next.js (App Router, código em `src/`).
Rode os quatro passos **nessa ordem** — cada um é mais caro que o anterior, então
pare e relate no primeiro que falhar em vez de seguir para o próximo:

1. `npm run typecheck` (`tsc --noEmit`) — mais rápido, pega erros de tipo e
   imports quebrados (ex. depois de mover um arquivo em `src/`).
2. `npm run lint` (`next lint`, config `next/core-web-vitals`).
3. `npm test` (`node --test tests/*.test.mjs`) — hoje é
   `tests/payment-contract.test.mjs`, que faz asserções estáticas sobre o
   fluxo de checkout/pagamento (ver `CLAUDE.md` seção 9). Se esse arquivo
   falhar com `ENOENT`, é sinal de que algo em `src/app/checkout/**`,
   `src/components/checkout/**` ou `src/services/account/meService.ts` foi
   movido sem atualizar os paths literais no topo do teste.
4. `npm run build` (`next build`) — único passo que valida de fato todas as
   rotas do App Router (gera as 21 páginas estáticas/dinâmicas). Depois de
   rodar, apague `.next/` se não for necessário mantê-lo (`rm -rf .next`) —
   não é versionado e não deve aparecer no `git status`.

Se `node_modules/` não existir ainda, rode `npm install` primeiro.

Depois de rodar `npm run build` ou `npm run typecheck`, confira
`git status --short` — esses comandos regeneram `next-env.d.ts`
automaticamente; se a única mudança for nesse arquivo, descarte-a com
`git checkout -- next-env.d.ts` para manter o diff limpo.

## Relatório final

Resuma em poucas linhas: quais dos 4 passos passaram, qual falhou (se algum) e
o trecho relevante do erro — não cole o output inteiro do build. Se tudo
passou, diga isso claramente em vez de só mostrar comandos.
