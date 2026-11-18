// Plano do sob medida pelo número de alunos.
// Cliente fundador (PRD-008) tem tolerância: onde o plano define founderMax,
// ele continua nesse plano até esse número (ex.: Social até 36, mesmo a faixa indo até 30).
export function tierFor(tiers, students, founder = false) {
  return tiers.find((t) => students <= (founder && t.founderMax ? t.founderMax : t.max)) ?? null
}
