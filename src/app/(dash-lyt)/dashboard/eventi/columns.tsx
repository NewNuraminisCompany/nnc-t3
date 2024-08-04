"use client"

import { deleteTorneo } from "@/components/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { TorneoData } from "@/types/db-types";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const ActionCell = ({ torneo }: { torneo: TorneoData }) => {
  const router = useRouter();

  const handleDelete = useCallback(async (torneo: TorneoData) => {
    console.log("Eliminazione torneo:", torneo);
    const result = await deleteTorneo(torneo);
    if (result.success) {
      toast.success("Torneo eliminato con successo");
      router.refresh();
    } else {
      toast.error("Non è stato possibile eliminare il torneo");
    }
  }, [router]);

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
          <DropdownMenuItem>
            <Link href={`/dashboard/eventi/${torneo.idTorneo}`}>Mostra evento</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex flex-row items-center justify-between text-destructive"
            onClick={() => handleDelete(torneo)}
          >
            Elimina 
            <Trash2 className="h-4 w-4" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const columns: ColumnDef<TorneoData>[] = [
  {
    accessorKey: "nome",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome Torneo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "dataInizio",
    header: "Data Inizio",
    cell: ({ row }) => row.original.dataInizio.toLocaleDateString(),
  },
  {
    accessorKey: "dataFine",
    header: "Data Fine",
    cell: ({ row }) => row.original.dataFine.toLocaleDateString(),
  },
  {
    accessorKey: "stato",
    header: "Stato",
    cell: ({ row }) => {
      const stato = row.original.stato
      switch (stato) {
        case "programmato":
          return "Programmato"
        case "inCorso":
          return "In corso"
        case "terminato":
          return "Terminato"
        default:
          return stato
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell torneo={row.original} />,
  },
]