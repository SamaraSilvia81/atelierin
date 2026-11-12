# Changelog

Todas as mudanças relevantes da landing do Atelierin ficam registradas aqui.
O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e as versões seguem o [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não lançado]

### Adicionado
- **Dois degraus de preço** ([`LP-ADR-005`](docs/decisoes/LP-ADR-005-preco-na-pagina.md)): Padrão (a partir de R$ 900, 5% com mínimo de R$ 110, infraestrutura R$ 45) e Personalizado (10x de R$ 300, 8% com mínimo de R$ 180, infraestrutura R$ 65)
- **Calculadora** em Planos: alunos, mensalidade, acesso dos alunos e vídeo; mostra o plano indicado, o mês e o 1º ano
- **Tabela "Uma vez, e todo mês"** comparando os dois planos
- **Lista de espera funcionando**: `functions/api/waitlist.js` grava no Cloudflare D1 (`db/schema.sql`) e envia confirmação pelo Resend; sem API, oferece o WhatsApp
- **Prévia na conversa** citada em Planos, no FAQ e na Proposta
- Proposta: slides de licença de uso, infraestrutura e vídeo, e cancelamento com 30 dias
- **Imagem de compartilhamento** (`og:image`) e metadados para redes sociais
- **E-mails com a identidade do Atelierin**: confirmação com fundo areia, assinatura da Samara, cartão no formato da ficha e o rodapé do site; aviso interno com contagem da fila por linha e total, e botões para responder e abrir o D1. Imagens em `public/email/`; os dois e-mails têm versão em texto puro

### Alterado
- Aviso interno da lista de espera só sai para inscrição nova (antes também saía quando o mesmo e-mail repetia)
- Planos: Personalizado no centro em destaque, "Disponível" em verde, só o valor centralizado com o "10x de" à esquerda
- FAQ: "quero um sistema só meu", "quanto eu pago por mês", "consigo ver antes de fechar", "e se eu crescer"

### Removido
- Opção "só a implantação" e a palavra "assinatura"
- Bloco "Com ou sem manutenção"

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
