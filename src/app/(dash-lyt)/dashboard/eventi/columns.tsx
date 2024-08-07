"use client"

import { deleteTorneo, EditTorneoData } from "@/components/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { TorneoData } from "@/types/db-types";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Credenza, CredenzaContent, CredenzaHeader, CredenzaTitle, CredenzaTrigger } from "@/components/ui/credenza";

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
      <Credenza>
        <CredenzaTrigger asChild>
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        </CredenzaTrigger>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Modifica Torneo</CredenzaTitle>
          </CredenzaHeader>
          <EditTorneoForm torneo={torneo} />
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
          <DropdownMenuItem>
            <Link href={`/dashboard/eventi/${torneo.idTorneo}`}>Mostra Partite</Link>
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
    cell: ({ row }) => new Date(row.original.dataInizio).toLocaleDateString(),
  },
  {
    accessorKey: "dataFine",
    header: "Data Fine",
    cell: ({ row }) => new Date(row.original.dataFine).toLocaleDateString(),
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

function EditTorneoForm({ torneo }: { torneo: TorneoData }) {
  const [formData, setFormData] = useState({
    ...torneo,
    dataInizio: new Date(torneo.dataInizio).toISOString().split('T')[0],
    dataFine: new Date(torneo.dataFine).toISOString().split('T')[0],
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStateChange = (value: string) => {
    setFormData((prev) => ({ ...prev, stato: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await EditTorneoData({
        ...formData,
        dataInizio: new Date(formData.dataInizio).toISOString(),
        dataFine: new Date(formData.dataFine).toISOString(),
      });
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
          <Label htmlFor="descrizione" className="text-right">
            Descrizione
          </Label>
          <Input
            id="descrizione"
            name="descrizione"
            value={formData.descrizione}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="dataInizio" className="text-right">
            Data Inizio
          </Label>
          <Input
            id="dataInizio"
            name="dataInizio"
            type="date"
            value={formData.dataInizio}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="dataFine" className="text-right">
            Data Fine
          </Label>
          <Input
            id="dataFine"
            name="dataFine"
            type="date"
            value={formData.dataFine}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="stato" className="text-right">
            Stato
          </Label>
          <Select onValueChange={handleStateChange} value={formData.stato}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Seleziona lo stato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="programmato">Programmato</SelectItem>
              <SelectItem value="inCorso">In corso</SelectItem>
              <SelectItem value="terminato">Terminato</SelectItem>
            </SelectContent>
          </Select>
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

export { EditTorneoForm };