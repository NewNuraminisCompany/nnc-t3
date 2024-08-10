import { unstable_flag as Flag } from "@vercel/flags/next";


export const unstableRisultati = Flag({
  key: "risultati_unstable",
  description: "Abilita pagina risultati (non completa)",
  decide: async () => false,
  defaultValue: false,
});

export const precomputeFlags = [unstableRisultati] as const;
