<picture>
  <source media="(prefers-color-scheme: light)" srcset="../../_assets/banners/docs/lp-adr-005-claro.webp">
  <img src="../../_assets/banners/docs/lp-adr-005.webp" alt="LP-ADR-005 · Preço na página" width="100%">
</picture>

# LP-ADR-005 · Preço na página

![status](https://img.shields.io/badge/status-aceita-080606) ![tipo](https://img.shields.io/badge/tipo-registro%20de%20decisão-1A1414) ![código](https://img.shields.io/badge/código-LP--ADR--005-C0211C)

| Campo | Valor |
|---|---|
| Código | `LP-ADR-005` |
| Data | quarta-feira, 11/11/2026 |
| Tipo | Registro de decisão |
| Status | Aceita |
| Decisão de | Samara Silvia |
| Referências | `PRD-005` · proposta comercial do Maxwell (v1.5, a atualizar na v1.6) |
| Redigido por | Samara Silvia |

**Sumário**

1. [Contexto](#-contexto)
2. [Decisão](#-decisão)
3. [Alternativas consideradas](#-alternativas-consideradas)
4. [Consequências](#-consequências)
5. [Revisitar quando](#-revisitar-quando)

---

### $ contexto

A primeira versão da landing não mostrava preço. Na negociação com o primeiro cliente ficou claro que o preço filtra quem chega e evita a mesma pergunta em toda conversa. Ao colocar o preço, apareceram três problemas:

1. **"Só a implantação" não cabia no produto.** O Atelierin é um sistema da autora: o cliente usa um ambiente por licença, e o código, a base e o Supabase continuam dela. Sem manutenção, o cliente usaria o sistema sem pagar por ele.
2. **"Assinatura" contradizia "um ambiente seu".** A palavra soava como "uma conta numa plataforma".
3. **R$ 3.000 + 8% pesava demais para quem tem poucos alunos.** Com 5 alunos a R$ 250, o cliente gastaria 20% da receita por mês e 40% no primeiro ano.

A simulação que levou à decisão:

| Alunos × mensalidade | Plano | Por mês | 1º ano (com implantação) |
|---|---|---|---|
| 5 × R$ 250 | Padrão só você | R$ 155 | R$ 2.760 |
| 8 × R$ 250 | Padrão com alunos | R$ 155 | R$ 3.060 |
| 20 × R$ 300 | Personalizado | R$ 545 | R$ 9.540 |
| 33 × R$ 300 (Maxwell) | Personalizado | R$ 857 | R$ 13.284 |

### $ decisão

**Dois degraus, o mesmo ambiente:**

| | Padrão | Personalizado |
|---|---|---|
| Para quem | Começando, até ~15 alunos | Turma formada, a partir de 15 alunos |
| Implantação (uma vez) | R$ 900 só para a profissional · R$ 1.200 com área dos alunos | R$ 3.000 ou 10x de R$ 300 |
| Manutenção (por mês) | 5% do recebido dos alunos, mínimo R$ 110 | 8% do recebido dos alunos, mínimo R$ 180 |
| Infraestrutura (por mês) | R$ 45 fixo | R$ 65 fixo |
| Vídeo | YouTube ou Google Drive | YouTube, Drive ou Bunny (à parte, ~R$ 49) |

1. **Subir de plano** custa só a diferença da implantação.
2. **O mínimo do Padrão** guarda a proporção do Personalizado: 180 × 5/8 = 112,50, arredondado para R$ 110.
3. **A infraestrutura é uma taxa fixa**, revista uma vez por ano. O Supabase é da autora; as taxas de todos os ambientes pagam a conta. Ela fica negativa só até o terceiro cliente, coberta pela manutenção.
4. **Licença de uso:** é do cliente a marca, o endereço, o conteúdo, os alunos e os dados; é da Atelierin o sistema, a hospedagem e o subdomínio. Quem quer o código só para si recebe outra proposta.
5. **Prévia na conversa:** a profissional vê o ambiente com a sua marca antes de fechar. O protótipo completo faz parte da implantação.
6. **Cancelamento** com 30 dias de aviso e exportação dos dados.
7. **Na página:** o card mostra só a implantação; o mensal fica na tabela "Uma vez, e todo mês" e na calculadora. Nenhum texto diz "sem comissão" nem "assinatura".
8. **Outras linhas:** lista de espera que grava de verdade (D1 + Resend).

### $ alternativas consideradas

| Opção | Por que não |
|---|---|
| Continuar sem preço | Toda conversa começava pela pergunta do preço |
| Um único plano de R$ 3.000 + 8% | Caro demais para quem tem poucos alunos |
| Padrão com mensal fixo tudo incluso (R$ 149) | A autora prefere manter a porcentagem, que acompanha o tamanho do cliente |
| Infraestrutura rateada pelo número de clientes | Valor muda a cada cliente novo e não cabe numa calculadora |
| Mínimo de R$ 60 no Padrão (1/3 de 180) | Não segue a proporção e deixa pouco para o suporte |
| Opção "só a implantação" | O sistema é da Atelierin; usar sem manutenção seria usar sem pagar |

### $ consequências

- Valores ficam em quatro lugares: `content.json > plans.pricing` e `plans.rules`, `faq.json` e `pages.json > proposal` ([`LP-OPR-001`](../LP-OPR-001-operacao-e-conteudo.md)).
- A proposta do Maxwell (v1.6) precisa trocar o rateio de R$ 71,42 pela taxa fixa de R$ 65 e formalizar a base dos 8%.
- O `PRD-005` do produto precisa receber os dois degraus.
- O preço é de fundador para o primeiro cliente; reajuste da tabela é anual, nunca por cliente.

### $ revisitar quando

- Entrar o quarto ambiente: revisar se as taxas de infraestrutura ainda cobrem o Supabase com folga.
- Abrir uma linha nova (Consult, Fit, Studio, Care): definir se segue os mesmos degraus.
- Um cliente do Padrão passar de 15 alunos: conferir se o corte faz sentido na prática.

---

<picture>
  <source media="(prefers-color-scheme: light)" srcset="../../_assets/banners/docs/rodape-claro.webp">
  <img src="../../_assets/banners/docs/rodape.webp" alt="Atelierin · rodapé da documentação" width="100%">
</picture>
