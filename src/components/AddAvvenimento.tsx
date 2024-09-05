"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Plus } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { fetchPlayers2, insertAvvenimento } from "./actions";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { Credenza, CredenzaBody, CredenzaContent, CredenzaHeader, CredenzaTitle, CredenzaTrigger } from "./ui/credenza";
import { createId } from "@paralleldrive/cuid2";

// Define the form schema
const formSchema = z.object({
  tipo: z.enum(["Goal", "Espulsione", "Ammonizione"]),
  minuto: z.number().min(0).max(90),
  giocatore: z.string().min(1, "Seleziona un giocatore"),
  idPartita: z.string().min(1, "Seleziona una partita"),
});

// Define the type for a Giocatore
type Giocatore = {
  nome: string;
  cognome: string;
  idSquadra: string;
  idGiocatore: string;
};

interface AddAvvenimentoProps {
  idTorneo: string;
  idPartita: string;
}

export default function AddAvvenimento({ idTorneo, idPartita }: AddAvvenimentoProps) {
  const [giocatori, setGiocatori] = useState<Giocatore[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      tipo: "Goal",
      minuto: 0,
      giocatore: "",
      idPartita: idPartita,
    },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const players = await fetchPlayers2(idTorneo, idPartita);
        setGiocatori([...players.playersSquadra1, ...players.playersSquadra2]);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Errore durante il caricamento dei dati");
      }
    }

    fetchData().catch(error => console.error("Unhandled error in fetchData:", error));
  }, [idTorneo]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await insertAvvenimento({
        idAvvenimento: createId(),
        idGiocatore: values.giocatore,
        idPartita: values.idPartita,
        tipo: values.tipo,
        minuto: values.minuto,
      });

      if (result.success) {
        toast.success("Avvenimento aggiunto con successo");
      } else {
        toast.error(result.error ?? "Non è stato possibile aggiungere l'avvenimento");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("C'è stato un errore durante l'aggiunta dell'avvenimento");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button>
          Aggiungi <Plus className="ml-2 h-4 w-4" />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Aggiungi avvenimento</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo di avvenimento</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Seleziona tipo di avvenimento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem key="Goal" value="Goal">
                              Goal
                            </SelectItem>
                            <SelectItem key="Espulsione" value="Espulsione">
                              Espulsione
                            </SelectItem>
                            <SelectItem key="Ammonizione" value="Ammonizione">
                              Ammonizione
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minuto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minuto</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="90"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="giocatore"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Giocatore</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Seleziona giocatore" />
                        </SelectTrigger>
                        <SelectContent>
                          {giocatori.map((giocatore) => (
                            <SelectItem
                              key={giocatore.idGiocatore}
                              value={giocatore.idGiocatore}
                            >
                              {giocatore.nome} {giocatore.cognome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Caricamento...
                  </>
                ) : (
                  "Salva"
                )}
              </Button>
            </form>
          </Form>
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}