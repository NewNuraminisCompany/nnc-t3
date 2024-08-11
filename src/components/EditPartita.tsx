import { PartitaData } from "@/types/db-types";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchNomiTutteSquadre, updatePartita } from "./actions";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { format } from "date-fns/format";
import { CalendarIcon, Loader2 } from "lucide-react";
import { TimePicker } from "./time-picker";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const formSchema = z.object({
  idPartita: z.string().min(1, "Seleziona una partita"),
  idSquadra1: z.string().min(1, "Seleziona una squadra"),
  idSquadra2: z.string().min(1, "Seleziona una squadra"),
  risultatoSquadra1: z.number().int().min(0),
  risultatoSquadra2: z.number().int().min(0),
  dataOra: z.date(),
  girone: z.enum(["gironeA", "gironeB", "gironeSemi", "gironeFinali"]),
});

type Squadra = {
  nome: string;
  idSquadra: string;
};

type EditPartitaProps = {
  idTorneo: string;
  partita: PartitaData;
};

export default function EditPartita({ idTorneo, partita }: EditPartitaProps) {
  const [nomiSquadre, setNomiSquadre] = useState<Squadra[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idPartita: partita.idPartita,
      idSquadra1: partita.idSquadra1,
      idSquadra2: partita.idSquadra2,
      risultatoSquadra1: partita.risultatoSquadra1,
      risultatoSquadra2: partita.risultatoSquadra2,
      dataOra: partita.dataOra,
      girone: partita.girone,
    },
  });

  useEffect(() => {
    void fetchSquadre();

    async function fetchSquadre() {
      try {
        const res = await fetchNomiTutteSquadre(idTorneo);
        setNomiSquadre(res);
      } catch (error) {
        console.error("Failed to fetch squadre:", error);
      }
    }
  }, [idTorneo]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await updatePartita({
        ...values,
        dataOra: new Date(values.dataOra),
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
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="idSquadra1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Casa</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Seleziona squadra" />
                  </SelectTrigger>
                  <SelectContent>
                    {nomiSquadre.map((squadra: Squadra) => (
                      <SelectItem key={squadra.idSquadra} value={squadra.idSquadra}>
                        {squadra.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="idSquadra2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trasferta</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Seleziona squadra" />
                  </SelectTrigger>
                  <SelectContent>
                    {nomiSquadre.map((squadra: Squadra) => (
                      <SelectItem key={squadra.idSquadra} value={squadra.idSquadra}>
                        {squadra.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <FormField
          control={form.control}
          name="dataOra"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data e Ora Partita</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPPpp")
                      ) : (
                        <span>Seleziona data e ora</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                  />
                  <div className="border-t border-border p-3">
                    <TimePicker setDate={field.onChange} date={field.value} />
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="girone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Girone</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleziona lo stato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gironeA">Girone A</SelectItem>
                    <SelectItem value="gironeB">Girone B</SelectItem>
                    <SelectItem value="gironeSemi">Semifinali</SelectItem>
                    <SelectItem value="gironeFinali">Finali</SelectItem>
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
              Salvataggio in corso...
            </>
          ) : (
            "Salva"
          )}
        </Button>
      </form>
    </Form>
  );
}
