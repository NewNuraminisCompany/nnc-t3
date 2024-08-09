"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader, Plus } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { submitPartita } from "./actions"; // Import the server action
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { TimePicker } from "./time-picker";

const formSchema = z.object({
  idSquadra1: z.string().min(1, "Select a team"),
  idSquadra2: z.string().min(1, "Select a team"),
  risultatoSquadra1: z.number().int().min(0),
  risultatoSquadra2: z.number().int().min(0),
  dataOra: z.date(),
  girone: z.enum(["gironeA", "gironeB", "gironeSemi", "gironeFinali"]),
});

type Squadra = {
  nome: string;
  idSquadra: string;
};

type AddPartitaProps = {
  nomi_squadre: Squadra[];
};

export const AddPartita: React.FC<AddPartitaProps> = ({ nomi_squadre }) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idSquadra1: "",
      idSquadra2: "",
      risultatoSquadra1: 0,
      risultatoSquadra2: 0,
      dataOra: new Date(),
      girone: "gironeA",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    values,
  ) => {
    setIsLoading(true);
    try {
      const { success, error } = await submitPartita({
        idSquadra1: values.idSquadra1,
        idSquadra2: values.idSquadra2,
        risultatoSquadra1: values.risultatoSquadra1,
        risultatoSquadra2: values.risultatoSquadra2,
        dataOra: values.dataOra,
        girone: values.girone,
      });

      if (success) {
        toast.success("Partita aggiunta con successo");
        form.reset();
      } else {
        toast.error("Errore durante l'aggiunta della partita: " + error);
      }
    } catch (error) {
      toast.error("Errore");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button>
          Aggiungi <Plus className="ml-2 h-4 w-4" />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Aggiungi Partita</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody className="mb-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="idSquadra1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Squadra 1</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Seleziona squadra" />
                          </SelectTrigger>
                          <SelectContent>
                            {nomi_squadre.map((squadra) => (
                              <SelectItem
                                key={squadra.nome}
                                value={squadra.idSquadra}
                              >
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
                      <FormLabel>Squadra 2</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Seleziona squadra" />
                          </SelectTrigger>
                          <SelectContent>
                            {nomi_squadre.map((squadra) => (
                              <SelectItem
                                key={squadra.nome}
                                value={squadra.idSquadra}
                              >
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
                              !field.value && "text-muted-foreground",
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
                          <TimePicker
                            setDate={field.onChange}
                            date={field.value}
                          />
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Seleziona girone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gironeA">Girone A</SelectItem>
                          <SelectItem value="gironeB">Girone B</SelectItem>
                          <SelectItem value="gironeSemi">
                            Girone Semi
                          </SelectItem>
                          <SelectItem value="gironeFinali">
                            Girone Finali
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
};
