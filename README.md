# Atelierin · landing page

Landing de [atelierin.com.br](https://atelierin.com.br). React 19 + Vite 7, CSS puro com os tokens da marca.

## Rodar

```bash
yarn
yarn dev       # desenvolvimento (com o botão "Editar layout" do hero)
yarn build     # gera dist/
yarn preview   # serve o dist/ localmente
```

Deploy: Cloudflare Pages, comando `yarn build`, pasta `dist`.

## Estrutura

```
public/
  brand/            logos SVG (cópias de 03-DESIGN/01-MARCA/logos)
  hero-desk.webp/jpg  foto do hero (gerada a partir de wallpaper-lp-atl-3)
  favicon.svg ...
src/
  content/          TODO o texto da página (ver docs/conteudo.md)
    content.json    seções, navegação, contato
    lines.json      as linhas (School, Consult, Fit, Studio, Care)
    faq.json        dúvidas
  lib/
    content.js      junta os JSON e monta os links de WhatsApp/e-mail
    useReveal.js    animação de entrada (respeita reduzir movimento)
    useHeroLayout.js modo Figma do hero (arrastar, mover com setas, escalar)
  components/       Header, Section, Button
  sections/         uma seção por arquivo, na ordem da página
  styles/
    tokens.css      cópia de 03-DESIGN/01-MARCA/tokens/tokens.css
    global.css      layout e componentes
```

## Páginas

| Caminho | Arquivo | Conteúdo |
| --- | --- | --- |
| `/` | `src/App.jsx` (Home) | landing |
| `/quem-faz` | `src/pages/About.jsx` | currículo da Samara |
| `/proposta` | `src/pages/Proposal.jsx` | proposta comercial em blocos tipo slide |
| `/casos` | `src/pages/Cases.jsx` | estudos de caso (01: Atelier.sh na ETE) |

O roteamento é um roteador mínimo em `src/lib/router.js` (sem dependência). No Cloudflare Pages, o `public/_redirects` manda qualquer caminho para o `index.html`. Os textos das páginas internas ficam em `src/content/pages.json`.

## Direção visual

**Hero (v2, aprovado):** foto de uma mesa de trabalho com monitor crimson ocupando a tela inteira. O texto fica dentro do monitor, em Bebas Neue (título, com efeito prata na segunda linha), Inter (texto) e JetBrains Mono (selo e endereço).
- O palco mantém a proporção da foto e cobre a tela, então os textos acompanham o monitor em qualquer tamanho. Em telas em pé eles saem do monitor e ficam empilhados.
- A posição de cada bloco vem de `hero.layout` em `content.json` e é ajustada no modo Figma (ver `docs/conteudo.md`).
- Campo de endereço editável: a pessoa digita o nome e vê `nome.atelierin.com.br`; o botão abre o WhatsApp com esse endereço.

**Topbar:** barra de vidro flutuante, links em mono com sublinhado crimson no hover, CTA claro com quadrado crimson.

**Demais seções (ainda na v1, a refazer):** alternam tema escuro e claro e usam o número da peça (`Nº 0X · Nome`), retalhos e etiquetas.

## Antes de publicar

- [ ] Preencher `site.whatsapp` e `site.contactEmail` em `content.json`
- [ ] Refazer as seções abaixo do hero no visual novo (estudo de caso, contato, briefing)
- [ ] Imagem de compartilhamento (`og:image`) 1200x630 com o gerador de banners
- [ ] Revisar textos com o caso real do Maxwell (com autorização dele)
