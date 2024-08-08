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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { submitPartita } from "./actions"; // Import the server action
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader, Plus } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const formSchema = z.object({
  idSquadra1: z.string().min(1),
  idSquadra2: z.string().min(1),
  risultatoSquadra1: z.number().int().min(0),
  risultatoSquadra2: z.number().int().min(0),
  dataOra: z.date(),
  giorne: z.enum(["giorneA", "gironeB", "gironeSemi", "gironeFinali"]),
});

export function AddPartita() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idSquadra1: "",
      idSquadra2: "",
      risultatoSquadra1: 0,
      risultatoSquadra2: 0,
      dataOra: new Date(),
      giorne: "giorneA",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    values
  ) => {
    setIsLoading(true);
    try {
      const { success, error } = await submitPartita({
        idSquadra1: values.idSquadra1,
        idSquadra2: values.idSquadra2,
        risultatoSquadra1: values.risultatoSquadra1,
        risultatoSquadra2: values.risultatoSquadra2,
        dataOra: values.dataOra.toISOString(),
        giorne: values.giorne,
      });

      if (success) {
        toast.success("Partita aggiunta con successo");
        form.reset();
      } else {
        toast.error("Errore durante l'aggiunta della partita: " + error);
      }
    } catch (error) {
      toast.error("Errore: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button>
          Aggiungi Partita <Plus className="ml-2 h-4 w-4" />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Aggiungi Partita</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody className="mb-2">
          <Form {...form}>
            <form
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="idSquadra1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Squadra 1</FormLabel>
                    <FormControl>
                      <Input placeholder="ID Squadra 1" {...field} />
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
                      <Input placeholder="ID Squadra 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          showTime
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="giorne"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Girone</FormLabel>
                    <FormControl>
                      <Input as="select" {...field}>
                        <option value="giorneA">Girone A</option>
                        <option value="gironeB">Girone B</option>
                        <option value="gironeSemi">Semifinali</option>
                        <option value="gironeFinali">Finali</option>
                      </Input>
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
}