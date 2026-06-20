# Guia de Entrega: Deploy em Vercel sem Falhas

> Baseado nos erros reais encontrados no projeto `adv-flashpages-ex`.  
> Todo repositório entregue pelo FlashPages deve satisfazer estas regras **antes** do primeiro push para `main`.

---

## Regra Zero: Rodar o build localmente antes de qualquer push

```bash
npm run build
```

Se esse comando falhar na sua máquina, **vai falhar no Vercel**. O ambiente Vercel é idêntico ao `next build` local. Não existe "funciona no dev mas não em produção" para erros de compilação — eles são determinísticos.

Rode também o lint separadamente:

```bash
npm run lint
```

Só faça push quando os dois comandos terminarem sem erros.

---

## Erro 1 — Aspas e apóstrofos literais em JSX

### O que acontece

O Next.js herda a regra ESLint `react/no-unescaped-entities` via `next/core-web-vitals`. Qualquer `"`, `'`, `>` ou `}` literal dentro de texto JSX causa erro de build.

```
Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`
react/no-unescaped-entities
```

### Causa

```tsx
// ERRADO — o build falha
<p>"Texto entre aspas"</p>
<p>Don't use raw apostrophes</p>
```

### Solução

Usar entidades HTML ou expressões JSX:

```tsx
// CORRETO — opção 1: entidades HTML
<p>&ldquo;Texto entre aspas&rdquo;</p>
<p>Don&apos;t use raw apostrophes</p>

// CORRETO — opção 2: expressão JSX (aspas tipográficas Unicode)
<p>{"\"Texto entre aspas\""}</p>

// CORRETO — opção 3: caracteres Unicode diretamente
<p>"Texto entre aspas"</p>
```

### Regra prática

| Caractere | Usar |
|-----------|------|
| `"` abre | `&ldquo;` |
| `"` fecha | `&rdquo;` |
| `'` apóstrofo | `&apos;` ou `&rsquo;` |
| `>` | `&gt;` |

Nunca colocar aspas retas (`"`) diretamente como texto dentro de tags JSX. Fora de JSX (em strings JS/TS normais) não há restrição.

---

## Erro 2 — Exportar dados de componentes Client para Server Components

### O que acontece

```
Error: Attempted to call map() from the server but map is on the client.
It's not possible to invoke a client function from the server.
Failed to collect page data for /
```

### Causa

No Next.js App Router, um arquivo com `'use client'` pertence inteiramente ao bundle do cliente. Quando um Server Component (qualquer `page.tsx` ou componente sem `'use client'`) importa **qualquer coisa** desse arquivo e executa no servidor (mesmo que seja um array simples), o Next.js lança este erro.

```tsx
// FAQSection.tsx
'use client'  // <-- marca o módulo inteiro como client
import { useState } from 'react'

export const faqItems = [...]  // exportado daqui

export function FAQSection() { ... }
```

```tsx
// app/page.tsx (Server Component)
import { faqItems } from '@/components/sections/FAQSection'
//                                                  ^^^ importando de um módulo 'use client'

const schema = {
  mainEntity: faqItems.map(...)  // ERRO: map() chamado no servidor
}
```

### Solução

**Separar dados de componentes.** Dados puros (arrays, objetos, constantes) nunca devem residir em arquivos `'use client'`. Eles ficam em arquivos de dados sem diretiva:

```
lib/
  faq-data.ts        ← dados puros, sem 'use client'
  practice-areas.ts  ← dados puros, sem 'use client'

components/
  sections/
    FAQSection.tsx   ← 'use client', importa de lib/faq-data.ts
```

```tsx
// lib/faq-data.ts — sem nenhuma diretiva, puro TypeScript
export const faqItems = [
  { question: '...', answer: '...' },
]
```

```tsx
// components/sections/FAQSection.tsx
'use client'
import { faqItems } from '@/lib/faq-data'  // importa os dados de fora

export function FAQSection() { ... }
```

```tsx
// app/page.tsx (Server Component)
import { faqItems } from '@/lib/faq-data'  // importa direto dos dados, não do componente

const schema = { mainEntity: faqItems.map(...) }  // funciona sem erros
```

### Regra prática

> Se um arquivo tem `'use client'`, ele **não pode exportar dados que serão consumidos por Server Components**. Dados compartilhados entre client e server vivem em `lib/`.

---

## Erro 3 — next.config.ts em vez de next.config.mjs

### O que acontece

```
Failed to load next.config.ts
```

### Causa

`next.config.ts` (TypeScript nativo) só é suportado a partir do Next.js 15. Para projetos em Next.js 14.x, o arquivo deve ser `next.config.js` ou `next.config.mjs`.

### Solução

```
next.config.mjs  ← correto para Next.js 14
next.config.js   ← também correto para Next.js 14
next.config.ts   ← apenas Next.js 15+
```

Conteúdo de `next.config.mjs`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // configurações
}

export default nextConfig
```

---

## Checklist pré-entrega

Execute estes comandos na raiz do projeto antes do primeiro push para `main`:

```bash
# 1. Instalar dependências
npm install

# 2. Verificar tipos TypeScript
npx tsc --noEmit

# 3. Verificar ESLint
npm run lint

# 4. Rodar o build completo
npm run build
```

Todos devem terminar com código de saída `0` (sem erros). Se qualquer um falhar, corrigir antes de entregar.

---

## Estrutura de arquivos recomendada

```
app/
  layout.tsx          ← Server Component (sem 'use client')
  page.tsx            ← Server Component (sem 'use client')
  [rota]/
    page.tsx          ← Server Component

components/
  sections/
    HeroSection.tsx   ← 'use client' se usar hooks/animações
    FAQSection.tsx    ← 'use client' se usar useState

  effects/
    RevealOnScroll.tsx
    SpotlightCard.tsx

  ui/
    Button.tsx

lib/
  utils.ts            ← funções utilitárias puras
  faq-data.ts         ← dados das FAQs (SEM 'use client')
  practice-areas.ts   ← dados das áreas (SEM 'use client')
  animations.ts       ← variantes framer-motion (SEM 'use client')
```

**Regra:** tudo em `lib/` é puro TypeScript sem dependências de browser. Tudo que precisa de `useState`, `useEffect`, eventos DOM, ou `window`/`document` vai em `components/` com `'use client'`.

---

## Referência rápida: quando usar `'use client'`

| Situação | Usar `'use client'`? |
|---|---|
| `useState`, `useEffect`, `useRef` | Sim |
| `onClick`, `onChange`, handlers de evento | Sim |
| `framer-motion` animations | Sim |
| Componente só renderiza HTML estático | Não |
| Array de dados / constantes | Não |
| Fetch de dados / metadados | Não |
| `metadata` export do Next.js | Não — e não pode coexistir com `'use client'` |

---

## Dependências e versões

O projeto usa Next.js **14.x**. Algumas restrições desta versão:

| Item | Next.js 14 | Next.js 15 |
|---|---|---|
| `next.config.ts` | ❌ não suportado | ✅ |
| App Router | ✅ estável | ✅ |
| Server Actions | ✅ estável | ✅ |
| `'use client'` boundary | Estrito | Estrito |

Não atualizar para Next.js 15 sem testar, pois há breaking changes (especialmente em `params` de páginas dinâmicas).

---

## Resumo

| Problema | Prevenção |
|---|---|
| Aspas literais em JSX | Usar `&ldquo;` / `&rdquo;` / `&apos;` |
| Dados em módulos `'use client'` | Mover dados para `lib/*.ts` |
| `next.config.ts` em Next.js 14 | Usar `next.config.mjs` |
| Deploy falha sem teste local | Rodar `npm run build` antes do push |
