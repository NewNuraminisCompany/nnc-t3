"use client";

import { deletePartita, fetchNomiTutteSquadre } from "@/components/actions";
import { EditPartita } from "@/components/EditPartita";
import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import type { PartitaData } from "@/types/db-types";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ActionCell = async ({ partita }: { partita: PartitaData }) => {
  const router = useRouter();

  const handleDelete = useCallback(
    async (partita: PartitaData) => {
      console.log("Eliminazione torneo:", partita);
      const result = await deletePartita(partita);
      if (result.success) {
        toast.success("Torneo eliminato con successo");
      } else {
        toast.error("Non è stato possibile eliminare il torneo");
      }
    },
    [router],
  );

  return (
    <div className="flex items-center space-x-2">
      <Credenza>
        <CredenzaTrigger asChild>
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        </CredenzaTrigger>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Modifica Partita</CredenzaTitle>
          </CredenzaHeader>
          <EditPartita
            idTorneo={idTorneo}
            partita={partita}
          />
        </CredenzaContent>
      </Credenza>
      <Button
        variant="ghost"
        className="h-8 w-8 p-0"
        onClick={() => handleDelete(partita)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const columns: ColumnDef<PartitaData>[] = [
  {
    accessorKey: "squadra1",
    header: "Casa",
    cell: ({ row }) => row.original.idSquadra1,
  },
  {
    accessorKey: "squadra2",
    header: "Trasferta",
    cell: ({ row }) => row.original.idSquadra2,
  },
  {
    accessorKey: "dataOra",
    header: "Data e Ora",
    cell: ({ row }) => new Date(row.original.dataOra).toLocaleString("it-IT"),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell partita={row.original} />,
  },
];
