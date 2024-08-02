"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

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
]