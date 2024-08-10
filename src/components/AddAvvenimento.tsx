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
import { Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { fetchPlayers2, fetchPartite2, insertAvvenimento } from "./actions";
import { Input } from "./ui/input";
import { toast } from "sonner";

const formSchema = z.object({
  id_avvenimento: z.string().min(1, "Seleziona un avvenimento"),
  tipo: z.enum(["Goal", "Espulsione", "Ammonizione"]),
  minuto: z.number().min(0).max(90),
  giocatore: z.string().min(1),
  idPartita: z.string().min(1),
});

type Giocator = {
  nome: string;
  idSquadra: string;
  idGiocatore: string;
};

interface AddAvvenimentoProps {
  idTorneo: string;
  idPartit: string;
}

export default function AddAvvenimento({ idTorneo, idPartit }: AddAvvenimentoProps) {
  const [Giocatori, setGiocatori] = useState<Giocator[]>([]);
  const [Partite, setPartite] = useState<
    { idPartita: string; label: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      id_avvenimento: "",
      tipo: "Goal",
      minuto: 0,
      giocatore: "",
      idPartita: "",
    },
  });

  useEffect(() => {
    async function fetchData() {
      const [players, matches] = await Promise.all([
        fetchPlayers2(idTorneo),
        fetchPartite2(idTorneo),
      ]);

      setGiocatori(players);

      if (matches) {
        setPartite(
          matches.map((match) => ({
            idPartita: match.idPartita,
            label: `${match.idSquadra1} vs ${match.idSquadra2}`,
          })),
        );
      } else {
        setPartite([]);
      }
    }

    fetchData();
  }, [idTorneo]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true); // Imposta isLoading a true prima di iniziare
    console.log("i dati del form: ",values);
    try {
      console.log("Form submitted with values:", values); // Log aggiuntivo per debug
      const result = await insertAvvenimento({
        idAvvenimento: values.id_avvenimento,
        idGiocatore: values.giocatore,
        idPartita: idPartit,
        tipo: values.tipo,
        minuto: values.minuto,
      });

      if (result.success) {
        toast.success("Dati modificati con successo");
      } else {
        toast.error("Non è stato possibile modificare i dati");
      }
    } catch (error) {
      console.error("Error during submission:", error); // Log l'errore nel caso si verifichi
      toast.error("C'è stato un errore durante la modifica dei dati");
    } finally {
      setIsLoading(false); // Reimposta isLoading a false dopo la fine della chiamata
    }
  }

  return (
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
                    {Giocatori.map((giocatore) => (
                      <SelectItem
                        key={giocatore.idGiocatore}
                        value={giocatore.idGiocatore}
                      >
                        {giocatore.nome}
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
  );
}
