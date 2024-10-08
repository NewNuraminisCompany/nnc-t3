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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { UploadButton } from "@/utils/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader, Plus } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { submitTorneo } from "./actions"; // Import the server action
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const formSchema = z.object({
  nomeTorneo: z.string().min(1).max(255),
  desc: z.string().min(1).max(255),
  dataInizio: z.date(),
  dataFine: z.date(),
  imageUrl: z.string().optional(),
});

export function AddTorneo() {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomeTorneo: "",
      desc: "",
      imageUrl: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    values,
  ) => {
    setIsLoading(true);
    try {
      const { success, error } = await submitTorneo({
        nome: values.nomeTorneo,
        descrizione: values.desc,
        dataInizio: values.dataInizio.toISOString(),
        dataFine: values.dataFine.toISOString(),
        imagePath: imageUrl, // Add the image URL to the submission
      });

      if (success) {
        toast.success("Evento aggiunto con successo");
        form.reset();
        setImageUrl("");
      } else {
        toast.error(`Errore durante l'aggiunta del torneo: ${String(error)}`);
      }
    } catch (error) {
      toast.error(`Errore: ${String(error)}`);
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
          <CredenzaTitle>Aggiungi torneo</CredenzaTitle>
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
                name="nomeTorneo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Es: Olimpiadi 2023" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrizione</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descrizione" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dataInizio"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data inizio torneo</FormLabel>
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

              <FormField
                control={form.control}
                name="dataFine"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data fine torneo</FormLabel>
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
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Locandina del torneo</FormLabel>
                    <FormControl>
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          if (res?.[0]?.url) {
                            setImageUrl(res[0].url);
                            console.log("Image uploaded:", res[0].url);
                            toast.success("Immagine caricata con successo");
                          }
                        }}
                        onUploadError={(error: Error) => {
                          console.log(
                            `Errore durante l'upload dell'immagine:`,
                            error,
                          );
                          toast.error(
                            `Errore durante l'upload dell'immagine: ${error.message}`,
                          );
                        }}
                      />
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
