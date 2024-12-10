"use client"
import type { ColumnDef } from "@tanstack/react-table";
import { deleteAvvenimento } from "@/components/actions";
import { useRouter } from "next/navigation";
import type { AvvenimentoData } from "@/types/db-types";
import { useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";
// Assuming your data structure looks like this:
/*
interface Avvenimento {
  nomeGiocatore: string;
  minuto: number;
  tipo: "Goal" | "Espulsione" | "Ammonizione";
  idPartita: string;
  idGiocatore: string;
  idAvvenimento: string;
}*/

// Define the columns
export const columns: ColumnDef<AvvenimentoData, unknown>[] = [
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
  {
    id: "actions",
    cell: ({ row }) => <ActionCell avvenimento={row.original} />,
  }
];



const ActionCell = ({ avvenimento }: { avvenimento: AvvenimentoData }) => {
  const router = useRouter();

  const handleDelete = useCallback(
    async (avvenimento: AvvenimentoData) => {
      console.log("Eliminazione avvenimento:", avvenimento);
      const result = await deleteAvvenimento(avvenimento);
      if (result.success) {
        toast.success("Avvenimento eliminato con successo");
        router.refresh();
      } else {
        toast.error("Non è stato possibile eliminare l'avvenimento");
      }
    },
    [router],
  );

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="flex flex-row items-center justify-between text-destructive"
            onClick={() => handleDelete(avvenimento)}
          >
            Elimina
            <Trash2 className="h-4 w-4" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};