import React, { Suspense } from "react";
import IscrizioniSquadre from "@/components/IscrizioniSquadre";
import { getTornei } from "@/components/actions";
import { CircleAlert } from "lucide-react";


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
    return <div className="flex flex-col items-center gap-y-4 justify-center min-h-[80vh]"><CircleAlert className="size-16 text-red-500"/> <p className="text-balance text-center text-muted-foreground">Al momento non c&apos;è nessun torneo programmato.</p></div>;
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
