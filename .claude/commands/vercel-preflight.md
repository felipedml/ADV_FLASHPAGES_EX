# vercel-preflight

Audita um repositório Next.js (App Router) e corrige todos os problemas que causariam falha no deploy da Vercel, antes do primeiro push para `main`. Baseado nos erros reais do projeto `adv-flashpages-ex`.

## Quando usar

Invocar com `/vercel-preflight` sempre que um repositório FlashPages estiver pronto para entrega mas ainda não tiver passado pelo primeiro deploy na Vercel.

---

## Passo 1 — Rodar o build local e capturar erros

```bash
npm install && npm run build 2>&1
```

Se o build passar limpo, reportar sucesso e encerrar. Se falhar, continuar para os passos seguintes e corrigir cada erro encontrado.

Rodar também o lint separado para capturar erros que o build pode suprimir:

```bash
npm run lint 2>&1
```

---

## Passo 2 — Corrigir aspas e caracteres literais em JSX

**Identificar** todos os arquivos `.tsx` com o padrão:

```
react/no-unescaped-entities
```

Buscar por aspas `"` ou apóstrofos `'` literais que apareçam como texto direto dentro de tags JSX — não dentro de atributos, não dentro de strings JS, apenas como conteúdo de texto.

**Padrões a procurar:**

```tsx
// ERRADO
<p>"texto entre aspas"</p>
<p>Don't fazer isso</p>
<h2>Advocacia que vai além do processo.</h2>  // ponto final é ok, aspas não
```

**Substituições corretas:**

| Caractere literal | Substituir por |
|---|---|
| `"` abre aspas | `&ldquo;` |
| `"` fecha aspas | `&rdquo;` |
| `'` apóstrofo | `&apos;` |
| `>` no texto | `&gt;` |

```tsx
// CORRETO
<p>&ldquo;texto entre aspas&rdquo;</p>
<p>Don&apos;t fazer isso</p>
```

Corrigir todos os arquivos afetados antes de continuar.

---

## Passo 3 — Auditar violações de boundary entre Server e Client Components

**Identificar** todos os arquivos com `'use client'` que também exportam dados não-componentes (arrays, objetos, constantes):

```bash
grep -rn "^'use client'" components/ --include="*.tsx" -l
```

Para cada arquivo encontrado, verificar se ele exporta algo além de funções de componente React:

```tsx
// VIOLAÇÃO: exportar dados de um módulo 'use client'
'use client'
export const items = [...]      // array de dados — não pode estar aqui
export const CONFIG = { ... }   // objeto de config ��� não pode estar aqui
export function MyComponent() { ... }  // componente — ok
```

**Verificar se esses exports são consumidos por Server Components** (arquivos em `app/` sem `'use client'`):

```bash
grep -rn "from '@/components/" app/ --include="*.tsx"
```

Para cada import em `app/`, checar se o símbolo importado é um dado (não um componente). Se for, é uma violação RSC.

**Corrigir:** mover os dados para `lib/`:

1. Criar `lib/[nome-descritivo]-data.ts` sem nenhuma diretiva
2. Mover o array/objeto para esse arquivo
3. No arquivo `'use client'` original, importar de `lib/` e re-exportar se necessário para compatibilidade
4. Em `app/page.tsx`, importar direto de `lib/`, nunca do componente

```tsx
// lib/faq-data.ts  ← sem 'use client', sem imports de React
export const faqItems = [
  { question: '...', answer: '...' },
]
```

```tsx
// components/sections/FAQSection.tsx
'use client'
import { faqItems } from '@/lib/faq-data'
export { faqItems } from '@/lib/faq-data'  // re-export para não quebrar imports existentes
```

```tsx
// app/page.tsx
import { faqItems } from '@/lib/faq-data'  // importar dos dados, não do componente
```

---

## Passo 4 — Verificar o arquivo next.config

**Verificar** qual arquivo de configuração do Next.js existe:

```bash
ls next.config.*
```

**Regra de compatibilidade:**

| Arquivo | Next.js 14 | Next.js 15+ |
|---|---|---|
| `next.config.js` | ✅ | ✅ |
| `next.config.mjs` | ✅ | ✅ |
| `next.config.ts` | ❌ Falha | ✅ |

Se o projeto usa Next.js 14 (verificar `package.json`) e existe `next.config.ts`, renomear para `next.config.mjs` e remover imports TypeScript:

```js
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // configurações
}

export default nextConfig
```

---

## Passo 5 — Verificar a versão do Next.js

Ler `package.json` e verificar a versão em `dependencies.next`.

- `14.x` → usar `next.config.mjs`, sem `next.config.ts`
- `15.x` → `next.config.ts` é aceito; atenção para breaking changes em `params` de páginas dinâmicas (agora são `Promise`)

---

## Passo 6 — Rodar o build novamente para confirmar

```bash
npm run build 2>&1
```

O build deve terminar com:

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Generating static pages (N/N)
```

Se ainda houver erros, voltar ao passo correspondente e corrigir.

---

## Passo 7 — Commitar e fazer push

Após build limpo, commitar todos os arquivos modificados com mensagem descritiva:

```bash
git add <arquivos corrigidos>
git commit -m "fix: corrigir erros de build para deploy na Vercel"
git push -u origin main
```

---

## Checklist de entrega

- [ ] `npm run build` passa sem erros
- [ ] `npm run lint` passa sem erros
- [ ] Nenhuma aspa `"` ou apóstrofo `'` literal em texto JSX
- [ ] Dados puros (arrays, objetos) fora de arquivos `'use client'`
- [ ] `app/page.tsx` não importa dados de módulos com `'use client'`
- [ ] Arquivo de configuração Next.js compatível com a versão usada
- [ ] `package-lock.json` incluído no repositório

---

## Estrutura de pastas esperada

```
lib/
  utils.ts          ← funções puras, sem 'use client'
  *-data.ts         ← todos os dados compartilhados, sem 'use client'
  animations.ts     ← variantes framer-motion, sem 'use client'

components/
  sections/         ← componentes com 'use client' quando usam hooks
  effects/          ← componentes de animação com 'use client'
  ui/               ← componentes base

app/
  layout.tsx        ← Server Component
  page.tsx          ← Server Component, importa dados de lib/
  [rota]/page.tsx   ← Server Component
```
