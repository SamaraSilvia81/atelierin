# Como editar o conteúdo

Todo texto da landing fica em `src/content/`. Não precisa mexer em componente para trocar texto.

| Arquivo | O que tem |
| --- | --- |
| `content.json` | site (contato), navegação, hero, problema, como funciona, sob medida, planos, CTA final, rodapé |
| `lines.json` | uma entrada por linha. `id` precisa bater com o nome do logo em `public/brand/atelierin-{id}-tinta-terminal-crimson.svg` |
| `faq.json` | perguntas e respostas |

## Regras

- **Esconder uma seção:** adicione `"enabled": false` no bloco dela em `content.json` (ex.: `"plans": { "enabled": false, ... }`).
- **Título com destaque:** `title` é a parte normal, `titleAccent` a parte em crimson. Deixe `titleAccent` vazio se não quiser destaque.
- **Status das linhas:** só `"Disponível"` ganha o destaque visual (card maior e selo crimson). Use `"Em breve"` ou `"Em estudo"` para as outras.
- **Ícones de "Sob medida":** valores aceitos em `icon`: `Palette`, `ToggleRight`, `Receipt`, `UsersThree`, `Sparkle`. Para outro ícone, importe em `src/sections/Custom.jsx` e adicione no mapa `ICONS`.
- **WhatsApp:** só números com DDI e DDD (ex.: `5581999999999`). Enquanto estiver com o texto entre colchetes, o botão aponta para `#contato`.
- **Preços:** a página não mostra valores de propósito (decisão em PRD-005). Não coloque preço aqui sem revisar o PRD.
