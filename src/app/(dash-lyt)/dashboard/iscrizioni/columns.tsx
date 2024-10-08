"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Credenza,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { deleteSquadra, updateSquadra } from "@/components/actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { EditTeamData, TeamData } from "@/types/db-types";

export type Squadre = {
  idSquadra: string
  nome: string
  colore: string
  cellulare: string
  statoAccettazione: boolean
  idTorneo: string | null
  nomeTorneo: string
}

const ActionCell = ({ squadra }: { squadra: Squadre }) => {
  const router = useRouter();
  const handleDelete = useCallback(async (squadra: EditTeamData) => {
    console.log("Eliminazione squadra:", squadra);
    const result = await deleteSquadra(squadra);
    if (result.success) {
      toast.success("Squadra eliminata con successo");
      router.refresh();
    } else {
      toast.error("Non è stato possibile eliminare la Squadra");
    }
  }, [router]);

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
            <CredenzaTitle>Modifica Squadra</CredenzaTitle>
          </CredenzaHeader>
          <EditSquadraForm squadra={squadra} />
        </CredenzaContent>
      </Credenza>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(squadra.idSquadra)}
          >
            Copia ID
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={`/dashboard/iscrizioni/${squadra.idSquadra}`}>Mostra squadra</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex flex-row items-center justify-between text-destructive"
            onClick={() => handleDelete(squadra)}
          >
            Elimina
            <Trash2 className="h-4 w-4" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const columns: ColumnDef<Squadre>[] = [
  {
    accessorKey: "nome",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nome Squadre
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
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
    cell: ({ row }) =>
      row.getValue("statoAccettazione") ? "Approvata" : "Non approvata",
  },
  {
    accessorKey: "nomeTorneo",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Torneo
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell squadra={row.original} />,
  },
];

function EditSquadraForm({ squadra }: { squadra: Squadre }) {
  const [formData, setFormData] = useState(squadra);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, statoAccettazione: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await updateSquadra(formData as EditTeamData);
      if (result.success) {
        toast.success("Dati modificati con successo");
      } else {
        toast.error("Non è stato possibile modificare i dati");
      }
    } catch (error) {
      toast.error("C'è stato un errore durante la modifica dei dati");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 md:px-0">
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="nome" className="text-right">
            Nome
          </Label>
          <Input
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="colore" className="text-right">
            Colore
          </Label>
          <Input
            id="colore"
            name="colore"
            value={formData.colore}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="cellulare" className="text-right">
            Cellulare
          </Label>
          <Input
            id="cellulare"
            name="cellulare"
            value={formData.cellulare}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="statoAccettazione"
            checked={formData.statoAccettazione}
            onCheckedChange={handleCheckboxChange}
          />
          <Label htmlFor="statoAccettazione">Approva Squadra</Label>
        </div>
      </div>
      <div className="flex justify-end pb-4 md:pb-0">
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvataggio in corso...
            </>
          ) : (
            "Salva"
          )}
        </Button>
      </div>
    </form>
  );
}