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

## Posição dos textos do hero (modo Figma)

1. Rode `npm run dev`. No canto inferior esquerdo aparece o botão **Editar layout** (ele não vai para o site publicado). Outra forma: abrir a página com `?editar` no fim do endereço.
2. **Arraste** o selo, o título, o texto e o campo de endereço. Eles grudam no centro do monitor; segure **Alt** para soltar livre.
3. **Clique** num bloco para selecionar (borda vermelha):
   - setas movem 0,5% (com **Shift**, 2%)
   - **+** e **-** aumentam e diminuem o bloco; **0** volta ao tamanho normal
   - **Esc** solta a seleção
4. Clique em **Copiar layout** e cole o resultado em `content.json`, no lugar de `hero.layout` (a linha `_comoUsar` pode ficar).
5. **Voltar ao do content.json** descarta o que você mexeu.

Valores: `x` e `y` são % da tela do monitor (50,50 = centro; `y: 100` = em cima da borda de baixo) e `s` é o tamanho (1 = normal). Como tudo é proporcional, a posição se mantém em qualquer tela deitada. No celular e em telas em pé o layout é ignorado e os blocos ficam empilhados.
