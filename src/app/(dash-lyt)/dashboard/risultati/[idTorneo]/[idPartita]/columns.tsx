"use client"
import type { ColumnDef } from "@tanstack/react-table";

// Assuming your data structure looks like this:
interface Avvenimento {
  nomeGiocatore: string;
  
  minuto: number;
  tipo: "Goal" | "Espulsione" | "Ammonizione";
}

// Define the columns
export const columns: ColumnDef<Avvenimento, unknown>[] = [
  {
    accessorKey: "nomeGiocatore",
    header: "Giocatore",
    cell: ({ getValue }) => getValue() as string, // Display the ID directly
  },
  {
    accessorKey: "minuto",
    header: "Minuto",
    cell: ({ getValue }) => getValue() as number, // Display the minute number
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ getValue }) => {
      const tipo = getValue() as "Goal" | "Espulsione" | "Ammonizione";
      // Optionally, you can map the value to a more readable format if needed
      switch (tipo) {
        case "Goal":
          return "Goal";
        case "Espulsione":
          return "Espulsione";
        case "Ammonizione":
          return "Ammonizione";
        default:
          return tipo;
      }
    },
  },
];
