# Atelierin · landing page

Landing de [atelierin.com.br](https://atelierin.com.br). React 19 + Vite 7, CSS puro com os tokens da marca.

## Rodar

```bash
npm install
npm run dev       # desenvolvimento
npm run build     # gera dist/
npm run preview   # serve o dist/ localmente
```

Deploy: Cloudflare Pages, comando `npm run build`, pasta `dist`.

## Estrutura

```
public/
  brand/            logos SVG (cópias de 03-DESIGN/01-MARCA/logos)
  favicon.svg ...
src/
  content/          TODO o texto da página (ver docs/conteudo.md)
    content.json    seções, navegação, contato
    lines.json      as linhas (School, Consult, Fit, Studio, Care)
    faq.json        dúvidas
  lib/
    content.js      junta os JSON e monta os links de WhatsApp/e-mail
    useReveal.js    animação de entrada (respeita reduzir movimento)
  components/       Header, Section, Button, Ruler
  sections/         uma seção por arquivo, na ordem da página
  styles/
    tokens.css      cópia de 03-DESIGN/01-MARCA/tokens/tokens.css
    global.css      layout e componentes
```

## Direção visual

"Ateliê sob medida": editorial de alta-costura encontra terminal.

- Seções alternam tema escuro (noir) e claro (areia) via `data-theme`.
- Cada seção tem o número da peça no estilo lookbook (`Nº 0X · Nome`).
- Elementos de ateliê: molde tracejado no hero, fita métrica, retalhos, etiquetas de preço com furo.
- Um acento crimson por tela. Crimson sobre noir só em título grande e logo; texto pequeno usa `--acc-text` (brasa).

## Antes de publicar

- [ ] Preencher `site.whatsapp` e `site.contactEmail` em `content.json`
- [ ] Imagem de compartilhamento (`og:image`) 1200x630 com o gerador de banners
- [ ] Revisar textos com o caso real do Maxwell (com autorização dele)
