-- Banco D1 da landing (Cloudflare). Rodar uma vez no painel do D1 (Console)
-- ou com: npx wrangler d1 execute atelierin-landing --remote --file=db/schema.sql
CREATE TABLE IF NOT EXISTS leads (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  kind        TEXT    NOT NULL,            -- 'linha' (lista de espera); depois: 'ficha', 'padrao'...
  email       TEXT    NOT NULL,
  area        TEXT,
  page        TEXT,
  status      TEXT    NOT NULL DEFAULT 'novo', -- novo | avisado | convertido | descadastrado
  UNIQUE (kind, email)
);
CREATE INDEX IF NOT EXISTS leads_kind_area ON leads (kind, area);
