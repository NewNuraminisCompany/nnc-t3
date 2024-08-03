import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { updateGiocatore } from "./actions";
import { Giocatore } from "@/app/(dash-lyt)/dashboard/iscrizioni/[idSquadra]/page";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export default function EditPlayer({ player }: { player: Giocatore }) {
    const [formData, setFormData] = useState(player);
    const [isLoading, setIsLoading] = useState(false);
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        const result = await updateGiocatore(formData);
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
      <form onSubmit={handleSubmit}>
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
            <Label htmlFor="cognome" className="text-right">
              Cognome
            </Label>
            <Input
              id="cognome"
              name="cognome"
              value={formData.cognome}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dataNascita" className="text-right">
              Data di Nascita
            </Label>
            
          </div>
        </div>
        <div className="flex justify-end">
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