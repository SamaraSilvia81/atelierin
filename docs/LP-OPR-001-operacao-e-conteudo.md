<picture>
  <source media="(prefers-color-scheme: light)" srcset="../_assets/banners/docs/lp-opr-001-claro.webp">
  <img src="../_assets/banners/docs/lp-opr-001.webp" alt="LP-OPR-001 · Operação e conteúdo" width="100%">
</picture>

# LP-OPR-001 · Operação e conteúdo

![status](https://img.shields.io/badge/status-vigente-080606) ![tipo](https://img.shields.io/badge/tipo-operação-1A1414) ![código](https://img.shields.io/badge/código-LP--OPR--001-C0211C)

| Campo | Valor |
|---|---|
| Código | `LP-OPR-001` |
| Data | quarta-feira, 11/11/2026 |
| Tipo | Operação |
| Status | Vigente |
| Versão do site | 0.1.0 |
| Substitui | `docs/conteudo.md` |
| Referências | [`LP-ARQ-001`](LP-ARQ-001-arquitetura.md) · [`LP-ARQ-002`](LP-ARQ-002-mapa-de-secoes.md) · [`LP-ADR-001`](decisoes/LP-ADR-001-conteudo-em-json.md) |
| Redigido por | Samara Silvia |

**Sumário**

1. [Rodar](#-rodar)
2. [Editar textos](#-editar-textos)
3. [Regras de conteúdo](#-regras-de-conteúdo)
4. [Ajustar o hero](#-ajustar-o-hero)
5. [Trocar imagens](#-trocar-imagens)
6. [Contato](#-contato)
7. [Lista de espera](#-lista-de-espera)
8. [Publicar](#-publicar)
9. [Antes de publicar](#-antes-de-publicar)
10. [Conferência visual](#-conferência-visual)
11. [Commits](#-commits)

---

### $ rodar

```bash
yarn            # primeira vez, ou depois de mudar o package.json
yarn dev        # http://localhost:5173
yarn build      # gera dist/
yarn preview    # serve o dist/ em http://localhost:4173
```

| Problema | O que fazer |
|---|---|
| Página em branco no `yarn dev` | Abrir o console (F12). Quase sempre é vírgula sobrando ou faltando num JSON |
| `/proposta` dá 404 no `yarn preview` | Normal no preview do Vite em alguns casos. No Cloudflare o `_redirects` resolve |
| Mudou o JSON e não atualizou | Salvar de novo o arquivo. Se persistir, parar e rodar `yarn dev` outra vez |

### $ editar textos

Todo texto fica em `src/content/`. Não precisa mexer em componente para trocar texto.

| Arquivo | O que tem |
|---|---|
| `content.json` | `site` (contato, sons), `a11y`, `nav`, `navCta`, `hero`, `problem`, `how` (inclui `steps`), `lines` (título), `custom`, `plans`, `finalCta`, `footer` |
| `lines.json` | Uma entrada por linha. `id` precisa bater com o logo em `public/brand/atelierin-{id}-tinta-terminal-crimson.svg` |
| `faq.json` | `piece`, `title` e `items` com `{ q, a }` |
| `pages.json` | `about` (Quem faz), `proposal` (slides da Proposta), `cases` (Casos) |

O mapa de qual chave vai para qual seção está no [`LP-ARQ-002`](LP-ARQ-002-mapa-de-secoes.md).

### $ regras de conteúdo

| Regra | Como |
|---|---|
| **Esconder uma seção** | `"enabled": false` no bloco dela em `content.json` (ex.: `"plans": { "enabled": false, ... }`) |
| **Título com destaque** | `title` é a parte normal, `titleAccent` a parte em crimson. Vazio se não quiser destaque |
| **Status das linhas** | Só `"Disponível"` ganha card maior e selo crimson. Use `"Em breve"` ou `"Em estudo"` nas outras |
| **Ícones** | Nomes do Phosphor que o componente já importa. Nos retalhos, o mapa é `ICONS` em `sections/Problem.jsx`: importe o ícone novo lá e acrescente no mapa |
| **Preço do plano** | `priceLabel` (rótulo em cima), `pricePre` ("10x de", à esquerda do valor), `price` (grande), `priceSub` (mono crimson), `priceExtra` (apoio). `priceBig` no lugar de tudo para um texto como "Sob proposta" |
| **Valores da calculadora** | `plans.pricing`: corte de alunos (`threshold`), implantação, porcentagem, mínimo e infraestrutura de cada plano. A tabela "Uma vez, e todo mês" fica em `plans.rules` e é texto: mudou um valor, mude nos dois |
| **Links internos** | Comece com `/` (ex.: `/proposta`, `/#planos`). O roteador intercepta sozinho |
| **Preços e manutenção** | Mudou valor, mude em quatro lugares: `content.json > plans.pricing` e `plans.rules`, `faq.json` e `pages.json > proposal`. O modelo está no [`LP-ADR-005`](decisoes/LP-ADR-005-preco-na-pagina.md) |
| **Texto** | Frases curtas, sem travessão, sem "sem comissão" (existe a manutenção de 8%) |

> **Atenção ao JSON:** aspas duplas, vírgula entre itens e nenhuma vírgula depois do último. Um erro deixa a página em branco.

### $ ajustar o hero

O hero tem um **modo Figma** para posicionar os textos dentro do monitor.

1. Rode `yarn dev`. No canto inferior esquerdo aparece **Editar layout** (não vai para o site publicado). Outra forma: abrir a página com `?editar` no fim do endereço, que funciona até no build.
2. **Arraste** o selo, o título, o texto e o campo de endereço. Eles grudam no centro do monitor; segure **Alt** para soltar livre.
3. **Clique** num bloco para selecionar (borda vermelha):
   - setas movem 0,5% (com **Shift**, 2%)
   - **+** e **-** aumentam e diminuem; **0** volta ao tamanho normal
   - **Esc** solta a seleção
4. **Copiar layout** e cole em `content.json`, no lugar de `hero.layout` (a linha `_comoUsar` pode ficar).
5. **Voltar ao do content.json** descarta o que foi mexido.

`x` e `y` são % da tela do monitor (50, 50 = centro; `y: 100` = borda de baixo) e `s` é o tamanho (1 = normal). Como tudo é proporcional, a posição se mantém em qualquer tela deitada. No celular e em telas em pé o layout é ignorado e os blocos ficam empilhados.

### $ trocar imagens

| Imagem | Arquivo | Formato |
|---|---|---|
| Foto do hero | `public/hero-desk.webp` (+ `.jpg` de reserva) | Mesma proporção, 1589 × 989. Se mudar a foto, a caixa do monitor precisa ser recalculada em `global.css` |
| Ilustração do rodapé | `public/footer-carmesim.webp` | Transparente em cima, opaca a partir de ~60% da altura |
| Foto da Quem faz | `public/samara.webp` | Retrato vertical, até ~100 KB |
| Caso Atelier.sh | `public/caso-atelier-sh-ete.webp` | |
| Passo a passo | `how.steps.items[].image.src` | Print 16:10 do ambiente real. Vazio = telinha animada |
| Logos | `public/brand/` | Copiar de `03-DESIGN/01-MARCA/logos` |

Converter para WebP com qualidade 80 a 90 (por exemplo no squoosh.app).

### $ contato

| Campo | Onde | Valor atual |
|---|---|---|
| WhatsApp | `site.whatsapp` | `5581994668775` (só números, com DDI e DDD) |
| WhatsApp exibido | `site.whatsappDisplay` | `(81) 99466-8775` |
| Mensagem padrão | `site.whatsappMessage` | Usada pelos botões que não montam texto |
| E-mail | `site.contactEmail` | Vazio. Enquanto vazio, o botão de e-mail não aparece |
| Sons ligados ao abrir | `site.soundsDefault` | `false` |

### $ lista de espera

O formulário de Outras linhas grava o pedido num banco **Cloudflare D1** e manda um e-mail de confirmação pelo **Resend**. Quem faz isso é a função `functions/api/waitlist.js`, que roda no próprio Cloudflare Pages.

```mermaid
flowchart LR
  F["Formulário<br/>e-mail + área"] -- "POST /api/waitlist" --> W["Pages Function<br/>waitlist.js"]
  W --> D[("D1<br/>tabela leads")]
  W -- "RESEND_API_KEY" --> R["Resend"]
  R --> P["E-mail de confirmação<br/>para a pessoa"]
  R -. "NOTIFY_TO" .-> S["Aviso para a Samara"]
```

**Configurar uma vez (no painel do Cloudflare):**

1. **Workers e Pages > D1 > Criar banco** com o nome `atelierin-landing`. Na aba **Console**, cole o conteúdo de `db/schema.sql` e execute.
2. No projeto da landing em **Pages > Configurações > Vinculações (Bindings)**, adicione um **Banco de dados D1** com o nome de variável `DB`, apontando para `atelierin-landing`.
3. Em **Configurações > Variáveis e segredos**:
   - `RESEND_API_KEY` (tipo **secreto**): a chave do Resend com permissão de envio
   - `MAIL_FROM`: `Atelierin <contato@atelierin.com.br>`
   - `NOTIFY_TO` (opcional): o seu e-mail, para receber um aviso a cada pedido novo
4. Faça um novo deploy para as variáveis valerem.

| Situação | O que acontece |
|---|---|
| Tudo configurado | Grava no D1, manda a confirmação e avisa você |
| Sem `RESEND_API_KEY` | Grava no D1, nenhum e-mail sai |
| Sem o banco (`DB`) ou rodando no `yarn dev` | A API responde erro e o formulário oferece o WhatsApp no lugar |
| Mesmo e-mail duas vezes | Não duplica: atualiza a área |

**Ver os pedidos:** D1 > `atelierin-landing` > Console: `SELECT * FROM leads ORDER BY created_at DESC;`. A coluna `status` (`novo`, `avisado`, `convertido`, `descadastrado`) fica pronta para o painel do Atelierin.

**Avisar quando a linha abrir:** por enquanto, liste os e-mails da área no Console (`SELECT email FROM leads WHERE area LIKE 'Fit%' AND status = 'novo';`) e mande pelo Gmail como contato@. O botão de envio em massa entra junto com o painel.

> A chave do Resend nunca vai para o código nem para o repositório: só como variável secreta no Cloudflare.

### $ publicar

Cloudflare Pages, ligado ao repositório:

| Campo | Valor |
|---|---|
| Framework | Nenhum (ou Vite) |
| Comando de build | `yarn build` |
| Pasta de saída | `dist` |
| Variável `NODE_VERSION` | `20` |
| Domínio | `atelierin.com.br` |

```mermaid
flowchart LR
  A["git push na main"] --> B["Cloudflare Pages<br/>yarn build"] --> C["dist/"] --> D["atelierin.com.br"]
  C -. "_redirects" .-> E["/proposta · /casos · /quem-faz<br/>abrem o index.html"]
```

As únicas variáveis são as da lista de espera (seção acima). O resto do site não fala com servidor nenhum.

### $ antes de publicar

- [x] WhatsApp preenchido
- [ ] E-mail completo em `site.contactEmail`
- [ ] Lista de espera configurada (D1, `RESEND_API_KEY`, `MAIL_FROM`) e testada com um e-mail seu
- [ ] Imagens reais no passo a passo
- [x] `og:image` 1200 × 630 no `index.html` (`public/og-image.jpg`)
- [ ] Textos revisados com o caso do Maxwell, com autorização dele
- [ ] `yarn build` sem erro e conferência visual (abaixo)

### $ conferência visual

Não há testes automatizados. Depois de qualquer mudança grande, conferir em `yarn preview`:

| Largura | O que olhar |
|---|---|
| 1440 px | Escala de 80%, hero dentro do monitor, cartões entre seções, trilha do passo a passo presa |
| 1100 px | Limite do zoom: nada deve pular ou cortar |
| 768 px | Tablet: hero empilhado, cards em duas colunas |
| 390 px | Celular: menu, ficha, planos em uma coluna |

E uma passada com **reduzir movimento** ligado no sistema.

### $ commits

Inglês, curtos, com prefixo:

```bash
git commit -m "feat: add cases page"
git commit -m "fix: hero address field on mobile"
git commit -m "style: footer text over illustration"
git commit -m "docs: landing documentation"
```

O `README.md` e o `CHANGELOG.md` são atualizados a cada versão.

---

<picture>
  <source media="(prefers-color-scheme: light)" srcset="../_assets/banners/docs/rodape-claro.webp">
  <img src="../_assets/banners/docs/rodape.webp" alt="Atelierin · rodapé da documentação" width="100%">
</picture>
