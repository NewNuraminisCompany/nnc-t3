"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
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
import { CalendarIcon, Loader, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { submitPlayer } from "./actions"; // Import the server action

const formSchema = z.object({
  idGiocatore: z.string(),
  nome: z.string().nonempty("Nome is required"), // Added nonempty validation for better feedback
  cognome: z.string().nonempty("Cognome is required"),
  cf: z.string().nonempty("Codice Fiscale is required"),
  dataNascita: z.date(),
  idSquadra: z.string()
});

export function AddGiocatore(iDSquadra: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idGiocatore: "",
      nome: "",
      cognome: "",
      cf: "",
      dataNascita: new Date(),
      idSquadra: iDSquadra
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (values) => {
    setIsLoading(true);
    console.log("Submitting form with values:", values); // Log form values

    try {
      const success = await submitPlayer({
        idGiocatore: "", // Ensure all fields are correctly passed
        nome: values.nome,
        cognome: values.cognome,
        dataNascita: values.dataNascita.toISOString(),
        cf: values.cf,
        idSquadra: values.idSquadra
      });

      if (success) {
        toast.success("Giocatore aggiunto con successo");
        form.reset();
        setImageUrl("");
      } else {
        toast.error(`Errore durante l'aggiunta del giocatore`);
      }
    } catch (error) {
      console.error("Submission error:", error); // Log any errors
      toast.error(`Errore: ${String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button>
          Aggiungi Giocatore <Plus className="ml-2 h-4 w-4" />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Aggiungi Giocatore</CredenzaTitle>
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
                name="nome"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome del giocatore" {...field} />
                    </FormControl>
                    {fieldState.error && <span className="text-red-500">{fieldState.error.message}</span>}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cognome"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Cognome</FormLabel>
                    <FormControl>
                      <Input placeholder="Cognome del giocatore" {...field} />
                    </FormControl>
                    {fieldState.error && <span className="text-red-500">{fieldState.error.message}</span>}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cf"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Codice Fiscale</FormLabel>
                    <FormControl>
                      <Input placeholder="Codice Fiscale" {...field} />
                    </FormControl>
                    {fieldState.error && <span className="text-red-500">{fieldState.error.message}</span>}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataNascita"
                render={({ field, fieldState }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data di Nascita</FormLabel>
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
                              format(field.value, "PPP")
                            ) : (
                              <span>Data di nascita</span>
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
                      </PopoverContent>
                    </Popover>
                    {fieldState.error && <span className="text-red-500">{fieldState.error.message}</span>}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  "Aggiungi Giocatore"
                )}
              </Button>
            </form>
          </Form>
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}
