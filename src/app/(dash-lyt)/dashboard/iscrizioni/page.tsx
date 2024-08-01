import React from "react";
import { DataTable } from "./data-table";
import { Squadre, columns } from "./columns";
import { db } from "@/server/db"; // Import your Drizzle ORM setup
import { squadre } from "@/server/db/schema"; // Import the schema
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

async function getData(): Promise<Squadre[]> {
  try {
    console.log("Attempting to fetch data from squadre table...");
    const result = await db.select().from(squadre);

    console.log(`Fetched ${result.length} records from squadre table.`);

    if (result.length === 0) {
      console.log("No records found in the squadre table.");
      return [];
    }

    return result.map((squadre) => {
      console.log("Processing squadre:", squadre);
      return {
        idSquadra: squadre.idSquadra,
        nome: squadre.nome,
        colore: squadre.colore,
        cellulare: squadre.cellulare,
        statoAccettazione: squadre.statoAccettazione,
        idTorneo: squadre.idTorneo
      };
    });
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
        <h1 className="text-4xl font-bold tracking-tight">Iscrizioni</h1>
        <Button>
          Aggiungi <Plus className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Iscrizioni;
