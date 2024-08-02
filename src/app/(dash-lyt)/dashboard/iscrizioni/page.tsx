import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { db } from "@/server/db";
import { squadre, tornei, gironi } from "@/server/db/schema";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { eq } from "drizzle-orm";

// Rinomina il tipo importato per evitare conflitti
import { Squadre as ImportedSquadre } from "./columns";

// Definisci un nuovo tipo che estende quello importato
type SquadreWithTorneoAndGirone = ImportedSquadre & {
  nomeTorneo: string;
  nomeGirone: string;
};

async function getData(): Promise<SquadreWithTorneoAndGirone[]> {
  try {
    console.log("Fetching data from squadre, tornei, and gironi tables...");
    const result = await db
      .select({
        idSquadra: squadre.idSquadra,
        nome: squadre.nome,
        colore: squadre.colore,
        cellulare: squadre.cellulare,
        statoAccettazione: squadre.statoAccettazione,
        idTorneo: squadre.idTorneo,
        nomeTorneo: tornei.nome,
        nomeGirone: gironi.nome,
      })
      .from(squadre)
      .leftJoin(tornei, eq(squadre.idTorneo, tornei.idTorneo))
      .leftJoin(gironi, eq(squadre.idSquadra, gironi.idSquadra));
    console.log(`Fetched ${result.length} records from squadre table.`);

    if (result.length === 0) {
      console.log("No records found in the squadre table.");
      return [];
    }

    return result.map((record) => ({
      idSquadra: record.idSquadra,
      nome: record.nome,
      colore: record.colore,
      cellulare: record.cellulare,
      statoAccettazione: record.statoAccettazione ?? false,
      idTorneo: record.idTorneo,
      nomeTorneo: record.nomeTorneo ?? "Torneo sconosciuto",
      nomeGirone: record.nomeGirone ?? "Girone non assegnato",
    }));
  } catch (error) {
    console.error("Error fetching squadre:", error);
    throw new Error(
      `Failed to fetch squadre: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

const Iscrizioni = async () => {
  const data = await getData();
  return (
    <div className="container mx-auto w-full pt-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">Iscrizioni Squadre</h1>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Iscrizioni;