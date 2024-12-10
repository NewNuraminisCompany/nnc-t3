import React, { Suspense } from "react";
import IscrizioniSquadre from "@/components/IscrizioniSquadre";
import { getTornei } from "@/components/actions";

const rawTournaments = await getTornei();

type Tournament = {
  idTorneo: string;
  nome: string;
  descrizione: string;
  dataInizio: string;
  dataFine: string;
  programmato: boolean;
  imagePath: string | null;
};

const tournaments: Tournament[] = rawTournaments.map(t => ({
  ...t,
  programmato: t.stato === "programmato"
}));

function checkIfProgrammato(tournaments: Tournament[]) {
  for (const tournament of tournaments) {
    if (tournament.programmato) {
      return false;
    }
  }
  return true;
}

export default function Iscrizioni() {
  if (checkIfProgrammato(tournaments)) {
    return <div>Nessun torneo programmato al momento.</div>;
  } else {
    return (
      <div className="flex w-full flex-col">
        <h1 className="my-4 text-4xl font-bold">Iscrizioni</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <IscrizioniSquadre />
        </Suspense>
      </div>
    );
  }
}
