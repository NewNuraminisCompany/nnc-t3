"use client";
import { Button } from "@/components/ui/button";
import type { TorneoData } from "@/types/db-types";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

// ActionCell component
const ActionCell = ({ torneo }: { torneo: TorneoData }) => {
  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm">
        <Link href={`/dashboard/risultati/${torneo.idTorneo}`}>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
};

// Columns definition
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
      );
    },
  },
  {
    accessorKey: "stato",
    header: "Stato",
    cell: ({ row }) => {
      const stato = row.original.stato;
      switch (stato) {
        case "programmato":
          return "Programmato";
        case "inCorso":
          return "In corso";
        case "terminato":
          return "Terminato";
        default:
          return stato;
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell torneo={row.original} />,
  },
];
