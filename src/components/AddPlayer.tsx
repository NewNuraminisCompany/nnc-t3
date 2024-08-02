"use client";
import { Button } from "@/components/ui/button";
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
import { addGiocatore } from "./actions"; // Import the server action for adding players
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader, Plus, X } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { toast } from 'sonner';
import * as z from "zod";
import { useRouter } from 'next/router';
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const formSchema = z.object({
  giocatori: z.array(z.object({
    cf: z.string().min(16).max(16),
    nome: z.string().min(1).max(255),
    cognome: z.string().min(1).max(255),
    dataNascita: z.date(),
  })),
});

export function AddGiocatori() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { idSquadra } = router.query; // Extract idSquadra from the dynamic route

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      giocatori: [],
    },
  });

  const { fields: giocatoriFields, append: appendGiocatore, remove: removeGiocatore } = useFieldArray({
    control: form.control,
    name: "giocatori",
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (values) => {
    setIsLoading(true);
    try {
      const { success, error } = await submitGiocatori({
        idSquadra, // Include idSquadra in the payload
        giocatori: values.giocatori.map(giocatore => ({
          cf: giocatore.cf,
          nome: giocatore.nome,
          cognome: giocatore.cognome,
          dataNascita: giocatore.dataNascita.toISOString(),
        })),
      });

      if (success) {
        toast.success('Giocatori aggiunti con successo');
        form.reset(); // Reset the form after successful submission
      } else {
        toast.error('Errore durante l&apos;aggiunta dei giocatori: ' + error);
      }
    } catch (error) {
      toast.error('Errore: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button>
          Aggiungi Giocatori <Plus className="ml-2 h-4 w-4" />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Aggiungi Giocatori</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody className="mb-2">
          <Form {...form}>
            <form
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="space-y-4">
                <FormLabel>Giocatori</FormLabel>
                {giocatoriFields.map((giocatore, giocatoreIndex) => (
                  <div key={giocatore.id} className="border p-4 rounded space-y-4">
                    <div className="flex justify-between items-center">
                      <h4>Giocatore {giocatoreIndex + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeGiocatore(giocatoreIndex)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormField
                      control={form.control}
                      name={`giocatori.${giocatoreIndex}.cf`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Codice Fiscale</FormLabel>
                          <FormControl>
                            <Input placeholder="Codice Fiscale" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`giocatori.${giocatoreIndex}.nome`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`giocatori.${giocatoreIndex}.cognome`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cognome</FormLabel>
                          <FormControl>
                            <Input placeholder="Cognome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`giocatori.${giocatoreIndex}.dataNascita`}
                      render={({ field }) => (
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
                                    <span>Seleziona una data</span>
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => appendGiocatore({
                  cf: "",
                  nome: "",
                  cognome: "",
                  dataNascita: new Date(),
                })}>
                  Aggiungi giocatore
                </Button>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader className="animate-spin h-5 w-5" /> : "Submit"}
              </Button>
            </form>
          </Form>
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}
