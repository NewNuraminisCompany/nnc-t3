import React from "react";
import { DataTable } from "./data-table";
import { Torneo, columns } from "./columns";
import { db } from "@/server/db"; // Import your Drizzle ORM setup
import { tornei } from "@/server/db/schema"; // Import the schema
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddTorneo } from "@/components/AddTorneo";

async function getData(): Promise<Torneo[]> {
  try {
    console.log("Attempting to fetch data from tornei table...");
    const result = await db.select().from(tornei);

    console.log(`Fetched ${result.length} records from tornei table.`);

    if (result.length === 0) {
      console.log("No records found in the tornei table.");
      return [];
    }

    return result.map((torneo) => {
      console.log("Processing torneo:", torneo);
      return {
        idTorneo: torneo.idTorneo,
        nome: torneo.nome,
        dataInizio: new Date(torneo.dataInizio),
        dataFine: new Date(torneo.dataFine),
        stato: torneo.stato as "programmato" | "inCorso" | "terminato",
      };
    });
  } catch (error) {
    console.error("Error fetching tornei:", error);
    throw new Error(
      `Failed to fetch tornei: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

const Eventi = async () => {
  const data = await getData();
  return (
    <div className="container mx-auto w-full pt-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">Eventi</h1>
        <AddTorneo />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Eventi;
