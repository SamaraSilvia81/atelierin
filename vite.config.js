import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { execFile } from "node:child_process";
import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Só no `yarn dev`: recebe o .tex do contrato (POST /__contrato/pdf),
// compila com o XeLaTeX instalado no computador e devolve o PDF.
// Não existe no build nem no site publicado.
function contractPdf() {
  const run = (cwd) => new Promise((ok, fail) =>
    execFile("xelatex", ["-interaction=nonstopmode", "-halt-on-error", "contrato.tex"], { cwd, timeout: 120000 },
      (err, stdout) => (err ? fail(Object.assign(err, { log: stdout })) : ok())));
  return {
    name: "contract-pdf",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__contrato/pdf", async (req, res) => {
        if (req.method !== "POST") { res.statusCode = 405; return res.end(); }
        let tex = "";
        for await (const chunk of req) tex += chunk;
        const dir = await mkdtemp(join(tmpdir(), "atelierin-contrato-"));
        try {
          await writeFile(join(dir, "contrato.tex"), tex, "utf8");
          await run(dir); await run(dir); // duas vezes: sumário e total de páginas
          res.setHeader("Content-Type", "application/pdf");
          res.end(await readFile(join(dir, "contrato.pdf")));
        } catch (e) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "text/plain; charset=utf-8");
          const missing = e.code === "ENOENT";
          res.end(missing ? "XeLaTeX não encontrado neste computador." : String(e.log || e.message).split("\n").filter((l) => l.startsWith("!") || l.startsWith("l.")).slice(0, 8).join("\n") || "Erro ao compilar.");
        } finally {
          rm(dir, { recursive: true, force: true }).catch(() => {});
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), contractPdf()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
});
