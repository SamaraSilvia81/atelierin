<picture>
  <source media="(prefers-color-scheme: light)" srcset="../../_assets/banners/docs/lp-adr-006-claro.webp">
  <img src="../../_assets/banners/docs/lp-adr-006.webp" alt="LP-ADR-006 · Mensal por faixa" width="100%">
</picture>

# LP-ADR-006 · Mensal por faixa

![status](https://img.shields.io/badge/status-aceita-080606) ![tipo](https://img.shields.io/badge/tipo-registro%20de%20decisão-1A1414) ![código](https://img.shields.io/badge/código-LP--ADR--006-C0211C)

| Campo | Valor |
|---|---|
| Código | `LP-ADR-006` |
| Data | quinta-feira, 12/11/2026 |
| Tipo | Registro de decisão |
| Status | Aceita |
| Substitui | a parte de manutenção e infraestrutura do [`LP-ADR-005`](LP-ADR-005-preco-na-pagina.md) |
| Decisão de | Samara Silvia |
| Referências | `NOT-002` · `PRD-005` · proposta do Maxwell (v1.6) |
| Redigido por | Samara Silvia |

**Sumário**

1. [Contexto](#-contexto)
2. [Decisão](#-decisão)
3. [Alternativas consideradas](#-alternativas-consideradas)
4. [Consequências](#-consequências)
5. [Revisitar quando](#-revisitar-quando)

---

### $ contexto

O `LP-ADR-005` cobrava o mensal em duas partes: manutenção em porcentagem do que o cliente recebe dos alunos (5% ou 8%, com mínimo) e infraestrutura fixa (R$ 45 ou R$ 65). Ao simular o primeiro cliente, apareceram quatro problemas:

1. **O valor ficava alto.** Com 33 alunos a R$ 300, o Maxwell pagaria R$ 857 por mês, cerca de 5 vezes uma plataforma pronta de gestão de alunos com a mesma quantidade de alunos.
2. **A porcentagem acompanha o faturamento do cliente, não o trabalho da Samara.** Se o cliente dobra de alunos, o mensal dobra sem o suporte dobrar.
3. **A mensalidade dos alunos varia** e depende do que o cliente informa. Nem o cliente nem a Samara sabiam quanto seria o mês seguinte.
4. **O degrau era decidido pelo número de alunos.** Quem tinha mais de 15 alunos ia para o Personalizado (R$ 3.000) mesmo sem nada a personalizar. Como o sistema é o mesmo para todos, isso cobrava personalização que não existiria.

### $ decisão

**1. Mensal fixo por faixa de alunos, com a infraestrutura incluída**, igual para os dois degraus. O nome é **licença e manutenção**.

| Alunos | Por mês |
|---|---|
| até 15 | R$ 190 |
| 16 a 30 | R$ 290 |
| 31 a 50 | R$ 390 |
| mais de 50 | sob consulta |

- **Base do cálculo (interna, não aparece para o cliente):** horas de suporte estimadas × R$ 80 + infraestrutura. A faixa de 31 a 50 parte de 4 h × R$ 80 + R$ 65 = R$ 385, arredondado para R$ 390.
- **Inclui:** licença de uso, hospedagem, banco de dados, domínio, cópias de segurança, atualizações de segurança, correções, monitoramento, suporte por mensagem e pequenos ajustes de texto e configuração.
- **O valor é fixo**, use o cliente o suporte ou não. Hora que não é usada não acumula. Funcionalidade nova não é suporte e tem orçamento à parte.
- **A proposta não fala em horas**, para o cliente não passar a contar o tempo.
- Vídeo próprio pelo Bunny continua à parte, só no Personalizado.
- Revisão uma vez por ano.

**2. O degrau é definido pela personalização, não pelo tamanho da turma.**

| | Padrão | Personalizado |
|---|---|---|
| Para quem | quer o ambiente como ele é, com a sua marca | quer o ambiente ajustado ao seu jeito de trabalhar |
| Implantação | R$ 900 · R$ 1.200 com área dos alunos | R$ 3.000 ou 10x de R$ 300 |

**3. A implantação paga a montagem, não a construção.** O sistema já existe e é o mesmo para todos. Os R$ 3.000 do Personalizado pagam montar o ambiente, aplicar a identidade, escolher os módulos e o vocabulário, cadastrar o que o cliente já tem e ensinar a usar (estimativa de 28 a 42 h, ou R$ 2.240 a R$ 3.360 a R$ 80/h).

**4. Produto e implantação são coisas separadas.** O que a Samara constrói no Atelierin e serve a todos é investimento dela, recuperado com os clientes ao longo do tempo. O que só serve a um cliente é orçamento à parte. O contrato diz que o que for feito na implantação continua sendo do sistema.

**5. Comparação na proposta.** Um slide novo ("comparando") coloca o Atelierin entre a plataforma pronta e o sistema só do cliente (a partir de R$ 15.000, com hospedagem e manutenção por hora por conta dele).

**6. Calculadora.** Pergunta só o número de alunos, o tipo de ambiente (como é / ajustado), o acesso dos alunos (no Padrão) e o vídeo. Não pergunta mais a mensalidade dos alunos.

### $ alternativas consideradas

| Opção | Por que não |
|---|---|
| Manter 5% e 8% | Valor alto, imprevisível e ligado ao faturamento do cliente |
| Porcentagem menor (4%) | Continua imprevisível e dependente do que o cliente informa |
| Fixo baixo (licença e infraestrutura, R$ 190) + suporte por hora | Conta imprevisível para o cliente, renda imprevisível para a Samara e discussão sobre o que é suporte |
| Faixas diferentes por degrau | O trabalho mensal é o mesmo nos dois; a diferença está na implantação |

### $ consequências

- Valores mudaram em `content.json > plans` (pricing, rules, calc, lede, items), `faq.json` e `pages.json > proposal` (slides 1, 2, 4, 6, 8, 9 novo e 10).
- `PriceCalc.jsx` foi reescrito para as faixas.
- A proposta passou de 12 para 13 slides.
- A proposta do Maxwell (v1.6) usa a faixa de 31 a 50 (R$ 390) e o Monograma como presente de primeiro cliente, mostrado com o valor riscado.
- A linha Encomendas (`NOT-002`) ainda cobra infraestrutura à parte e precisa ser alinhada a este modelo.

### $ revisitar quando

- Um cliente passar de 50 alunos: definir a faixa seguinte.
- As horas reais de suporte de um cliente ficarem acima de 4 por mês por três meses seguidos.
- Entrar o quarto ambiente: conferir se o Supabase cabe com folga nas faixas.

---

<picture>
  <source media="(prefers-color-scheme: light)" srcset="../../_assets/banners/docs/rodape-claro.webp">
  <img src="../../_assets/banners/docs/rodape.webp" alt="Atelierin · rodapé da documentação" width="100%">
</picture>
