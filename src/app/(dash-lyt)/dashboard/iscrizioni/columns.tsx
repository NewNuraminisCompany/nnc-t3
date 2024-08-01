"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

export type Squadre = {
    idSquadra: string
    nome: string
    colore: string
    cellulare: string
    statoAccettazione: boolean
    idTorneo: string
}

export const columns: ColumnDef<Squadre>[] = [
  {
    accessorKey: "nome",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nome
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: "colore",
    header: "Colore",
  },
  {
    accessorKey: "cellulare",
    header: "Cellulare",
  },
  {
    accessorKey: "statoAccettazione",
    header: "Stato",
    cell: ({ row }) => (row.getValue("statoAccettazione") ? "Approvata" : "Non approvata"),
  },
  {
    accessorKey: "idTorneo",
    header: "Torneo",
  },
]