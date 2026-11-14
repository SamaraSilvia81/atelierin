# Changelog

Todas as mudanças relevantes da landing do Atelierin ficam registradas aqui.
O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e as versões seguem o [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não lançado]

### Adicionado
- **Cliente fundador** ([`PRD-008`](../../00-DOCS/01-PRODUTO/PRD-008-cliente-fundador-R00.md)), só no plano Personalizado: faixa carmim no topo do card Personalizado; card claro (branco, borda tinta e sombra carmim, como o cartão de conversa da proposta) entre os três cards e a tabela, com o status de vagas em cima, o −20% no canto direito, o que recebe × o que entrega e o formulário **Quero uma vaga** + **Ver as regras** lado a lado; coluna **Personalizado fundador** com os 20% aplicados na tabela e linha "Como fundador" na calculadora quando o Personalizado está escolhido. Regras num lugar só, `content.founder`
- **Faixa fixa acima do topo** (`components/Promo.jsx`, `PromoBar`): "Cliente fundador: 20% a menos no mensal do Personalizado", com link para `/fundador`; a barra do topo desce junto (`--promo-h`). Duas versões para teste A/B: **fixa** (frase parada) e **letreiro** (mono, andando em loop, pausa no hover e fica parada com "reduzir movimento"); a padrão vem de `founder.announce.style` e `?faixa=a` ou `?faixa=b` na URL troca na hora
- **Modal de fundador ao abrir o site** (`PromoModal`): imagem, −20%, texto da troca, formulário e WhatsApp; abre a cada carregamento e fecha no X, no Esc ou clicando fora; não abre em `/fundador` nem nas propostas de cliente
- **Lista de fundadores**: `functions/api/waitlist.js` aceita `interest: "fundador"` (grava em `leads` com `kind = 'fundador'`) e manda confirmação e aviso interno com textos de fundador
- **Rodapé**: link "Cliente fundador" em Conheça
- **Página `/fundador`** com as regras completas (quem pode ser, o que recebe, o que entrega, quando acaba) e a tabela de faixas com o desconto calculado
- **Proposta do cliente: cliente fundador**: `"founder": true` em `deal` no `dados.json` aplica o desconto no mensal (valor de tabela riscado nos cards e no modal) e o modal "Redigir contrato" ganha a escolha "Cliente fundador"
- **Contrato: cliente fundador** (bloco `%<IF:fundador>`): linha no quadro-resumo, item na cláusula do mensal e a cláusula "Do programa cliente fundador" (desconto sobre a tabela vigente, até 2 funcionalidades do catálogo, contrapartida, perda do benefício e intransferível)
- **Redigir contrato** na proposta do cliente (só no `yarn dev`): o slide "sua proposta" tem as duas opções clicáveis e o botão que abre um modal com tudo que mexe em dinheiro (opção, alunos, identidade, entrada à vista ou em até 10x, vencimento, vídeo, reajuste) e os dados das partes. No fim gera o **contrato** (formal, em cláusulas, quadro-resumo, testemunhas, capa no estilo da proposta em creme) e a **fatura** da entrada (itens, parcelas com datas, Pix), em `.tex` e PDF. Modelos em `src/content/contrato.tex` e `fatura.tex`; o PDF é compilado pelo XeLaTeX do computador por uma rota do Vite que só existe em desenvolvimento (`/__contrato/pdf`)
- **Proposta por cliente** em `/proposta/<cliente>`: os dados ficam em `public/proposta/<cliente>/dados.json` (fora do código), entram como slides extras e trocam o título e o nome no diagrama; só abre rodando local (`yarn dev`); a pasta do cliente está no `.gitignore` e não vai para o GitHub nem para o site. Primeiro caso: `/proposta/maxwell`, com as duas opções e o Monograma de presente
- **Versões da proposta** em `/versoes/`: página A/B com duas versões lado a lado (rolagem junto, trocar lados, uma de cada vez) e cópias congeladas v1 a v5 em `public/versoes/vN/`
- **Proposta: diagrama do caminho** (`FlowMap`): fundo quadriculado, blocos e ligações em ângulo reto; clicar numa etapa ou num bloco acende e anima só aquela parte; `?para=nome` troca "você" pelo nome do cliente
- **Proposta: hero novo** com faixa carmesim, o símbolo gigante cortado pela borda, alinhavos e botões de costura, textura de papel e tarja no título
- **Proposta: cada slide com desenho próprio** (seu × meu, ficha da implantação, tabela dos degraus, itens riscados, botão grande) e detalhe gráfico da identidade (faixa, fita métrica, alinhavo, símbolo)
- **Proposta: "Ainda não tem marca?"** com Monograma e Identidade básica, o que não entra e o registro no INPI (taxa paga pelo cliente, link oficial)
- **Proposta: "Quer também uma página para divulgar?"** com cards de preço (página simples inclusa, landing page R$ 2.500, combo R$ 5.000) e um exemplo da página simples
- **Proposta: "Prazo combinado, contrato assinado"** com prazos por serviço, as reuniões, o que o contrato garante e o aviso sobre pressa
- **Proposta: conversa de exemplo** ao lado de "Começa com uma conversa"
- **Dois degraus de preço** ([`LP-ADR-005`](docs/decisoes/LP-ADR-005-preco-na-pagina.md)): Padrão (a partir de R$ 900, 5% com mínimo de R$ 110, infraestrutura R$ 45) e Personalizado (10x de R$ 300, 8% com mínimo de R$ 180, infraestrutura R$ 65)
- **Calculadora** em Planos: alunos, mensalidade, acesso dos alunos e vídeo; mostra o plano indicado, o mês e o 1º ano
- **Tabela "Uma vez, e todo mês"** comparando os dois planos
- **Lista de espera funcionando**: `functions/api/waitlist.js` grava no Cloudflare D1 (`db/schema.sql`) e envia confirmação pelo Resend; sem API, oferece o WhatsApp
- **Prévia na conversa** citada em Planos, no FAQ e na Proposta
- Proposta: slides de licença de uso, infraestrutura e vídeo, e cancelamento com 30 dias
- **Imagem de compartilhamento** (`og:image`) e metadados para redes sociais
- **E-mails com a identidade do Atelierin**: confirmação com fundo areia, assinatura da Samara, cartão no formato da ficha e o rodapé do site; aviso interno com contagem da fila por linha e total, e botões para responder e abrir o D1. Imagens em `public/email/`; os dois e-mails têm versão em texto puro

### Alterado
- Identidade básica de R$ 1.200 para R$ 850; slide de comparação sem o alinhavo pontilhado
- **Mensal por faixa de alunos** ([`LP-ADR-006`](docs/decisoes/LP-ADR-006-mensal-por-faixa.md)): sai a manutenção em porcentagem e a infraestrutura separada; entra a licença e manutenção fixa (R$ 190 até 15 alunos, R$ 290 de 16 a 30, R$ 390 de 31 a 50, acima sob consulta), igual nos dois degraus
- Padrão e Personalizado agora se diferenciam pelo quanto o ambiente é ajustado, não pelo número de alunos
- Calculadora sem a mensalidade dos alunos: pergunta alunos, tipo de ambiente, acesso e vídeo
- Tabela "Uma vez, e todo mês" e FAQ ("quanto eu pago por mês", "se já existe um ambiente parecido", Hotmart, "e se eu crescer") com o modelo novo
- Proposta: slide 1 sem "sob medida", implantação explicada como montagem de um sistema que já existe, manutenção como licença e manutenção, slide 08 com as faixas, slide 09 novo comparando plataforma pronta, Atelierin e sistema só do cliente, contrato com reajuste anual e o que é feito na implantação continuando do sistema
- Proposta, ajustes finais: zoom 10% menor só na proposta; cards do 07 mais largos; exemplo da Ana Ribeiro sem menu (página única), com "Ver valores" e o depoimento em duas linhas centralizadas; textos maiores no 10 (prazos, reuniões e contrato); no 12, o número em cima do título, o texto à esquerda e a conversa maior, centralizada sobre a faixa vermelha, com a área escura à direita
- Proposta: 02 escuro, 03 claro, 04 escuro; slide 08 com tabela maior e mais distante do exemplo; "Começa com uma conversa" com o número em cima e a conversa maior ao lado
- Proposta: fundos dos slides definidos um a um (claro/escuro); exemplo da página simples centralizado atravessando a divisa entre o slide 07 e o 08, como banner real (foto de fundo em `public/proposta/exemplo-fundo.jpg` e, se existir, o mockup em `public/proposta/exemplo-tablet.png`)
- Proposta: diagrama maior, com as etapas embaixo; ficha da implantação em camadas, sem card; identidade com Monograma R$ 450 e Identidade básica R$ 1.200 (com dois mockups), INPI como aviso embaixo; infraestrutura e vídeo em tabela; "de sua escolha" nas integrações
- Seção 2 (retalhos): os cards viraram módulos prontos do ambiente de exemplo (Atendimento, Materiais, Cobrança, Agenda, Evolução), cada um dizendo de qual retalho veio; status "em dia" e "atenção"
- Clique num card abre o módulo no lugar dos cards, com recorte circular a partir do card clicado, tabela completa e abas; depois passa sozinho de um módulo para o outro, em loop, com o mesmo recorte e a barra de progresso de "A marca é sua" (pausa com o mouse em cima); "todos os módulos" ou Esc volta
- Seção 2 com demonstração: um cursor filtra, abre um módulo, rola a lista e volta, em loop (Atenção → Cobrança, Em dia → Agenda, Todos → Atendimento); se a pessoa clicar em algo, o cursor some e ela assume
- Seção 2 com três módulos (Atendimento, Cobrança, Agenda) e listas mais longas, com rolagem
- Sons: o áudio é liberado no primeiro clique ou tecla da página (regra do navegador; rolar não conta)
- Mais espaço entre o texto de apoio da seção 2 e os cards, e entre os cards e "O Atelierin junta os retalhos"
- "O Atelierin junta os retalhos…" se digita sozinho quando a pessoa rola até ela, com som de tecla quando os sons estão ligados
- Rodapé: "Todos os direitos reservados" e "Desenvolvido com 🤍 por Samara Silvia Sabino"
- "Tudo começa pela linha certa" centralizado entre o passo a passo e as linhas, com fita métrica, rótulo e destaque em "linha certa"
- Linha de alinhavo: a segunda laçada ficou mais aberta e a curva final mais longa
- Textos maiores nas respostas do FAQ e no passo a passo (descrição, "entrega", "o que você me passa")
- Aviso interno da lista de espera só sai para inscrição nova (antes também saía quando o mesmo e-mail repetia)
- Planos: Personalizado no centro em destaque, "Disponível" em verde, só o valor centralizado com o "10x de" à esquerda
- FAQ: "quero um sistema só meu", "quanto eu pago por mês", "consigo ver antes de fechar", "e se eu crescer"

### Removido
- Opção "só a implantação" e a palavra "assinatura"
- Bloco "Com ou sem manutenção"

### Corrigido
- Slide 12 da proposta ficava mais estreito que a tela por causa de uma regra antiga com o nome `.slide-cta`

## [0.1.0] · 11/11/2026

Primeira versão completa da landing, ainda não publicada.

### Adicionado
- **Hero:** foto da mesa com monitor crimson; título, texto e campo de endereço dentro da tela do monitor, com proporção mantida em qualquer tela deitada. Modo Figma para posicionar os blocos (`yarn dev` ou `?editar`)
- **Topbar:** barra de vidro flutuante, links em mono, botão de sons e CTA "Quero meu ambiente"
- **Escala de 80%** no desktop a partir de 1100 px ([`LP-ADR-003`](docs/decisoes/LP-ADR-003-escala-de-80.md))
- **Retalhos:** chips de terminal, cards no formato dos grupos do Atelier.sh com filtro e contador, mancha clara avançando para a seção seguinte e costura animada com duas laçadas
- **Como funciona:** núcleo, módulos e linhas, com o painel "Você escolhe as peças" sobre a divisa entre escuro e claro
- **Passo a passo:** trilha que se preenche com a rolagem, no esquema da pipeline da Check.AI, com uma telinha animada por passo enquanto não há prints reais
- **Troca de tema em cartão** (efeito Miro) em Como funciona, Linhas e A marca é sua ([`LP-ADR-004`](docs/decisoes/LP-ADR-004-troca-de-tema-em-cartao.md))
- **A marca é sua:** três estilos de login com transição em círculo e digitação automática
- **Planos:** School Personalizado com "10x de R$ 300" em destaque, "ou R$ 3.000 à vista" e manutenção de 8%; Padrão (em breve) e Outras linhas (sob proposta); comparativo "Com ou sem manutenção" e nota sobre por que o valor muda ([`LP-ADR-005`](docs/decisoes/LP-ADR-005-preco-na-pagina.md))
- **Dúvidas:** perguntas sobre preço do molde, implantação sem manutenção, como funcionam os 8% e para onde vai o dinheiro dos alunos
- **Ficha "Vamos tirar as suas medidas":** nome, chips e campo livre que viram mensagem pronta no WhatsApp
- **Rodapé** com o texto sobre a ilustração carmesim
- **Páginas** Quem faz (com foto), Proposta (em slides) e Casos (Atelier.sh na ETE), com roteador próprio ([`LP-ADR-002`](docs/decisoes/LP-ADR-002-roteador-proprio.md))
- **Sons** do Atelier.sh, desligados por padrão
- **Voltar ao topo**
- **Documentação** no padrão dos docs da marca: README, índice, `LP-ARQ-001`, `LP-ARQ-002`, `LP-DSG-001`, `LP-OPR-001` e cinco ADRs, com banners e prints

### Alterado
- Textos que diziam "sem comissão" passaram a dizer "nenhuma taxa por transação", porque existe a manutenção percentual
- `docs/conteudo.md` substituído pelo `LP-OPR-001`

### Removido
- Efeito de cartão em Planos, Dúvidas e Ficha (a parte de decisão fica parada)
