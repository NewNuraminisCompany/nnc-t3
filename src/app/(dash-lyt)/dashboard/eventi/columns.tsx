"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link";
import {
  Credenza,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table"
import Evento from "@/app/(user-lyt)/eventi/[eventID]/page";
import { deleteTorneo } from "@/components/actions";
import { toast } from "sonner";
import { revalidatePath } from "next/cache";
import { tornei } from "@/server/db/schema";


export type Torneo = {
    idTorneo: string
    nome: string
    dataInizio: Date
    dataFine: Date
    stato: "programmato" | "inCorso" | "terminato"
}

export const columns: ColumnDef<Torneo>[] = [
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
    cell: ({ row }) => {
      const torneo = row.original;
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
                <Link
                  href={`/dashboard/eventi/${torneo.idTorneo}`}
                >Mostra evento</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex flex-row items-center justify-between text-destructive"
                onClick={() => handleDelete(torneo)}
              >
                Elimina evento
                <Trash2 className="h-4 w-4" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
  
]
async function handleDelete(torneo: Torneo) {
  console.log("Eliminazione torno:", torneo);
  const result = await deleteTorneo(torneo);
  if (result.success) {
    toast.success("Torneo eliminato con successo");
    revalidatePath("/dashboard/eventi");
  } else {
    toast.error("Non è stato possibile eliminare il torneo");
  }
}
