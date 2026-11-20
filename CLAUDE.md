# ATELIERIN-LANDING · Landing e proposta

- Stack: React 19, Vite 7, yarn 4, roteador próprio (LP-ADR-002), Cloudflare Pages Functions em `functions/api`, D1 em `db/schema.sql`. Docs da landing usam prefixo `LP-`.
- Todo texto e preço vive em `src/content` (`content.json`, `faq.json`, `pages.json`). Preços do simulador ficam em `plans.pricing` no `content.json`. Nunca escrever preço no JSX.
- Mudou preço ou plano: conferir `content.json`, `faq.json`, a proposta (`pages.json`) e o contrato (`contrato.tex`).
- Texto dos slides é escrito e aprovado antes de implementar.
- Identidade: cards com canto quase reto e borda fina, sem cantos arredondados. Proposta geral em tema light. Todo documento abre e fecha com o banner do gerador.
- "Montar contrato" e modo canetinha só aparecem no localhost. Só existe a rota `/proposta` geral.
- Seção do cliente fundador está desligada (`founder.enabled: false`).
- Responsivo: adaptar a composição, mostrar tamanho por tamanho antes de aplicar.
- Regras gerais: `AGENCIA-S\CLAUDE.md`.
