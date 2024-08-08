"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Palette, Phone, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { submitTeamAndPlayers } from "./actions";
import ComboBoxIscrizioni from "./ComboBoxIscrizioni";
import { Card } from "./ui/card";
import { useSearchParams } from "next/navigation";

const codiceFiscaleRegex = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/;

const teamFormSchema = z.object({
  teamName: z.string().min(1, "Inserire il nome della squadra").max(255),
  teamColor: z.string().min(1, "Inserire il colore della squadra").max(255),
  myNumber: z
    .string()
    .regex(/^\+?[0-9]{6,14}$/, "Inserire un numero di telefono della squadra"),
  tournamentId: z.string().min(1, "Seleziona un torneo"),
});

const playerFormSchema = z.object({
  playerName: z.string().min(1, "Inserire il nome del giocatore").max(255),
  playerSurname: z
    .string()
    .min(1, "Inserire il cognome del giocatore")
    .max(255),
  playerID: z.string().regex(codiceFiscaleRegex, "Codice fiscale non valido"),
  playerDateOfBirth: z.date().refine((date) => date <= new Date(), {
    message: "La data di nascita non può essere nel futuro",
  }),
});

type TeamFormData = z.infer<typeof teamFormSchema>;
type PlayerFormData = z.infer<typeof playerFormSchema>;

type Player = PlayerFormData;

export default function IscrizioniSquadre() {
  const searchParams = useSearchParams(); // TODO: aggiungi parametri per combobox

  const [step, setStep] = useState(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [teamInfo, setTeamInfo] = useState<TeamFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const teamForm = useForm<TeamFormData>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      teamName: "",
      teamColor: "",
      myNumber: "",
      tournamentId: "",
    },
    mode: "onBlur",
  });

  const playerForm = useForm<PlayerFormData>({
    resolver: zodResolver(playerFormSchema),
    defaultValues: {
      playerName: "",
      playerSurname: "",
      playerID: "",
      playerDateOfBirth: new Date(),
    },
    mode: "onBlur",
  });

  const onTeamSubmit: SubmitHandler<TeamFormData> = (values) => {
    setTeamInfo(values);
    setStep(1);
  };

  const onPlayerSubmit: SubmitHandler<PlayerFormData> = (values) => {
    setPlayers([...players, values]);
    playerForm.reset();
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const canProceedToReview = players.length >= 5;

  const goToReview = () => {
    if (canProceedToReview) {
      setStep(2);
    }
  };

  const handleFinalSubmit = async () => {
    if (!teamInfo) return;

    setIsSubmitting(true);

    try {
      const result = await submitTeamAndPlayers({
        team: {
          nome: teamInfo.teamName,
          colore: teamInfo.teamColor,
          cellulare: teamInfo.myNumber,
          statoAccettazione: false,
          idTorneo: teamInfo.tournamentId,
        },
        players: players.map((player) => ({
          cf: player.playerID,
          nome: player.playerName,
          cognome: player.playerSurname,
          dataNascita: format(player.playerDateOfBirth, "yyyy-MM-dd"),
        })),
        idTorneo: teamInfo.tournamentId,
      });

      if (result.success) {
        console.log("Data submitted successfully");
        toast.success("Iscrizione effettuata con successo");
        redirect("/");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Errore nell'invio dei dati");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {step === 0 && (
        <Form {...teamForm}>
          <form
            onSubmit={teamForm.handleSubmit(onTeamSubmit)}
            className="space-y-6"
          >
            <FormField
              control={teamForm.control}
              name="tournamentId"
              render={({ field }) => (
                <FormItem className="flex flex-col pt-4">
                  <FormControl>
                    <ComboBoxIscrizioni
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={teamForm.control}
              name="teamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome squadra</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome Squadra" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={teamForm.control}
              name="teamColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Colore squadra</FormLabel>
                  <FormControl>
                    <Input placeholder="Colore" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={teamForm.control}
              name="myNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefono squadra</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Numero di Telefono"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Avanti</Button>
          </form>
        </Form>
      )}

      {step === 1 && (
        <Form {...playerForm}>
          <form
            onSubmit={playerForm.handleSubmit(onPlayerSubmit)}
            className="space-y-8"
          >
            <div className="mb-4">
              <ScrollArea className="overflow-x-auto whitespace-nowrap rounded-md">
                <div className="flex space-x-4">
                  {players.map((player, index) => (
                    <Card
                      key={index}
                      className="flex max-w-xs flex-shrink-0 items-center justify-between space-x-2 p-4"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold">
                          {player.playerName} {player.playerSurname}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {player.playerID}
                        </span>
                      </div>
                      <Button
                        type="button"
                        onClick={() => removePlayer(index)}
                        variant="outline"
                        className="hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </Card>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>

            <FormField
              control={playerForm.control}
              name="playerName"
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
              control={playerForm.control}
              name="playerSurname"
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
              control={playerForm.control}
              name="playerID"
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
              control={playerForm.control}
              name="playerDateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data di nascita</FormLabel>
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
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between">
              <Button type="submit" disabled={players.length >= 10}>
                {players.length < 5 ? `Aggiungi` : "Aggiungi giocatore"}
              </Button>
              <Button
                type="button"
                onClick={goToReview}
                disabled={!canProceedToReview}
              >
                Rivedi
              </Button>
            </div>
          </form>
        </Form>
      )}

      {step === 2 && (
        <div>
          <Card className="mb-4 p-4">
            <h2 className="text-2xl font-bold tracking-tight">{teamInfo?.teamName}</h2>
            <p>
              <strong>Torneo:</strong> {teamInfo?.tournamentId}
            </p>
            <p className="flex flex-row gap-x-2 items-center">
              <strong><Palette className="size-4" /></strong> {teamInfo?.teamColor}
            </p>
            <p className="flex flex-row gap-x-2 items-center">
              <strong><Phone className="size-4"/></strong> {teamInfo?.myNumber}
            </p>
          </Card>
          <ScrollArea className="overflow-x-auto whitespace-nowrap rounded-md w-full">
            <div className="flex space-x-4">
              {players.map((player, index) => (
                <Card
                  key={index}
                  className="flex max-w-xs flex-shrink-0 items-center justify-between space-x-2 p-4"
                >
                  <div className="flex flex-col">
                    <span className="font-bold">
                      {player.playerName} {player.playerSurname}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {player.playerID} <br />
                      {format(player.playerDateOfBirth, "PPP")}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <Button
            type="button"
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className="gap-y-2"
          >
            {isSubmitting ? "Invio in corso..." : "Invia"}
          </Button>
        </div>
      )}

      {step > 0 && (
        <Button type="button" onClick={() => setStep((prev) => prev - 1)}>
          Indietro
        </Button>
      )}
    </div>
  );
}
