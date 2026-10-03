---
name: novo-campo-catalogo
description: >
  Adiciona ou ajusta um campo vindo do backend para eventos, álbuns, turmas ou
  empresas (catálogo público) neste projeto (coracao-gaucho-next), propagando
  a mudança de forma consistente por tipos, mapper, service e UI. Use quando o
  usuário disser que o backend mudou/adicionou um campo no payload de
  /api/public/events, /api/public/albums, /api/public/albums/{slug}/photos ou
  /api/public/empresas.
---

# Adicionar/ajustar campo do catálogo público

O catálogo público (eventos, álbuns, turmas, empresas) segue uma camada fixa
em `src/services/public/`: `types.ts` → `mappers.ts` → `*Service.ts` → consumido
pelos componentes em `src/components/catalog/` e pelas páginas em `src/app/`.
Siga essa ordem para não deixar nada dessincronizado.

## Passo a passo

1. **`src/services/public/types.ts`**: adicione o campo novo no tipo
   normalizado (`PublicEvent`, `PublicAlbum`, `PublicClass` ou
   `PublicEmpresa`), como opcional (`campo?: tipo`) a menos que o backend
   garanta que ele sempre existe.

2. **`src/services/public/mappers.ts`**: no mapper correspondente
   (`mapEventFromApi`, `mapAlbumFromApi`, `mapClassFromApi`, etc.), adicione a
   extração do campo **com fallback de nomenclatura** — este backend já
   mudou nomes de campo entre PT e EN no passado, então siga o padrão
   existente:

   ```ts
   campoNovo: optionalString(item.campoNovo ?? item.campo_novo ?? item.campoEmPortugues)
   ```

   Use os helpers já existentes no arquivo (`stringValue`, `optionalString`,
   `optionalNumber`, `optionalNullableNumber`, `optionalBoolean`) em vez de
   escrever parsing manual novo.

3. **UI**: se o campo deve aparecer visualmente, o ponto de entrada mais
   comum é `EventCardData` em `src/components/ui/EventCard.tsx` e as funções
   `toCard`/`mapEventToCard` espalhadas em `src/app/bilheteria/page.tsx`,
   `src/app/bilheteria/eventos/[slug]/EventDetailsPage.tsx`,
   `src/components/catalog/PublicEventsCarousel.tsx` e
   `src/components/catalog/PublicClassesSection.tsx` — todas convertem
   `PublicEvent`/`PublicClass` para `EventCardData`. Atualize todas as que
   fizerem sentido para o campo novo, não só uma.

4. **Formatação**: se o campo for data/hora/moeda, use os helpers de
   `src/utils/publicFormatters.ts` (`formatEventDate`, `formatEventTime`,
   `formatShortDate`, `formatCurrency`, `formatPrice`) em vez de formatar
   inline — eles já tratam fuso (UTC fixo) e locale pt-BR.

5. **Documentação do contrato**: atualize o schema correspondente em
   `public/docs/openapi.yaml` (`PublicEventApi`, `PublicAlbumApi`, etc.) —
   essa spec é a documentação do que o frontend espera da API e precisa
   continuar refletindo a realidade. Para mudanças maiores de contrato, use
   o agente `.claude/agents/catalog-api-sync.md`.

6. Rode a skill `validar-build` (pelo menos `npm run typecheck`) antes de
   considerar terminado.

Nunca assuma que um campo só tem um nome possível no payload bruto do
backend — esse catálogo já demonstrou historicamente variar entre
`title`/`titulo`/`name`/`nome`, `city`/`cidade`, etc.
