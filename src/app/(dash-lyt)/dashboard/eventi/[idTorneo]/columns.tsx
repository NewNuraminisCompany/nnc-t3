"use client";

import { deletePartita, updatePartita } from "@/components/actions";
import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PartitaData } from "@/types/db-types";
import { ColumnDef } from "@tanstack/react-table";
import {
  Edit,
  Loader2,
  Trash2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const ActionCell = ({ partita }: { partita: PartitaData }) => {
  const router = useRouter();

  const handleDelete = useCallback(
    async (partita: PartitaData) => {
      console.log("Eliminazione partita:", partita);
      const result = await deletePartita(partita);
      if (result.success) {
        toast.success("Partita eliminata con successo");
        router.refresh();
      } else {
        toast.error("Non è stato possibile eliminare la partita");
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
          <EditPartitaForm partita={partita} />
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
    cell: ({ row }) => (row.original.idSquadra1),
  },
  {
    accessorKey: "squadra2",
    header: "Trasferta",
    cell: ({ row }) => (row.original.idSquadra2),
  },
  {
    accessorKey: "dataOra",
    header: "Data e Ora",
    cell: ({ row }) => new Date(row.original.dataOra).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell partita={row.original} />,
  },
];

function EditPartitaForm({ partita }: { partita: PartitaData }) {
  const [formData, setFormData] = useState({
    ...partita,
    dataInizio: new Date(partita.dataOra).toISOString().split("T")[0],
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
      const result = await updatePartita({
        ...formData,
        dataOra: new Date(formData.dataOra),
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
          <Label htmlFor="casa" className="text-right">
            Casa
          </Label>
          <Input
            id="casa"
            name="casa"
            value={formData.idSquadra1}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="trasferta" className="text-right">
            Trasferta
          </Label>
          <Input
            id="trasferta"
            name="trasferta"
            value={formData.idSquadra2}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="dataOra" className="text-right">
            Data e Ora
          </Label>
          <Input
            id="dataOra"
            name="dataOra"
            type="date"
            value={formData.dataOra.toDateString()}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="stato" className="text-right">
            Girone
          </Label>
          <Select onValueChange={handleStateChange} value={formData.girone}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Seleziona lo stato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gironeA">Girone A</SelectItem>
              <SelectItem value="gironeB">Girone A</SelectItem>
              <SelectItem value="gironeSemi">Semifinali</SelectItem>
              <SelectItem value="gironeFinali">Finali</SelectItem>
            </SelectContent>
          </Select>
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
      </div>
    </form>
  );
}

export { EditPartitaForm };

