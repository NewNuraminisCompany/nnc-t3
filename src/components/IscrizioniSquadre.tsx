"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ArrowRight, CalendarIcon, Palette, Phone, Plus, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import ComboBoxIscrizioni from "./ComboBoxIscrizioni";
import { submitTeamAndPlayers } from "./actions";

const codiceFiscaleRegex = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/;

const teamFormSchema = z.object({
  teamName: z.string().min(1, "Inserire il nome della squadra").max(255),
  teamColor: z.string().min(1, "Inserire il colore della squadra").max(255),
  myNumber: z.string().regex(/^\+?[0-9]{6,14}$/, "Inserire un numero di telefono della squadra"),
  tournamentId: z.string().min(1, "Seleziona un torneo"),
});

const playerFormSchema = z.object({
  playerName: z.string().min(1, "Inserire il nome del giocatore").max(255),
  playerSurname: z.string().min(1, "Inserire il cognome del giocatore").max(255),
  playerID: z.string().regex(codiceFiscaleRegex, "Codice fiscale non valido"),
  playerDateOfBirth: z.date().refine((date) => date <= new Date(), {
    message: "La data di nascita non può essere nel futuro",
  }),
});

type TeamFormData = z.infer<typeof teamFormSchema>;
type PlayerFormData = z.infer<typeof playerFormSchema>;

const IscrizioniSquadre: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = React.useState(0);
  const [players, setPlayers] = React.useState<PlayerFormData[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const torneoIdFromUrl = searchParams.get("torneoId");

  const teamForm = useForm<TeamFormData>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      teamName: "",
      teamColor: "",
      myNumber: "",
      tournamentId: torneoIdFromUrl ?? "",
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

  React.useEffect(() => {
    if (torneoIdFromUrl) {
      teamForm.setValue("tournamentId", torneoIdFromUrl);
    }
  }, [torneoIdFromUrl, teamForm]);

  const onTeamSubmit = useCallback((values: TeamFormData) => {
    setStep(1);
  }, []);

  const onPlayerSubmit = useCallback(
    (values: PlayerFormData) => {
      setPlayers((prevPlayers) => [...prevPlayers, values]);
      playerForm.reset();
    },
    [playerForm]
  );

  const removePlayer = useCallback((index: number) => {
    setPlayers((prevPlayers) => prevPlayers.filter((_, i) => i !== index));
  }, []);

  const canProceedToReview = players.length >= 5;

  const goToReview = useCallback(() => {
    if (canProceedToReview) {
      setStep(2);
    }
  }, [canProceedToReview]);

  const handleFinalSubmit = useCallback(async () => {
    const teamInfo = teamForm.getValues();
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
        toast.success("Iscrizione effettuata con successo");
        router.push("/");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Errore nell'invio dei dati");
    } finally {
      setIsSubmitting(false);
    }
  }, [players, router, teamForm]);

  const renderTeamForm = useMemo(
    () => (
      <Form {...teamForm}>
        <form id="teamForm" onSubmit={teamForm.handleSubmit(onTeamSubmit)} className="space-y-6">
          <Controller
            name="tournamentId"
            control={teamForm.control}
            render={({ field }) => (
              <FormItem className="flex flex-col pt-4">
                <FormControl>
                  <ComboBoxIscrizioni
                    value={field.value}
                    onChange={(value: string) => {
                      field.onChange(value);
                      router.push(`/iscrizioni?torneoId=${value}`, undefined);
                    }}
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
                  <Input type="tel" placeholder="Numero di Telefono" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    ),
    [teamForm, onTeamSubmit, router]
  );

  const renderPlayerForm = useMemo(
    () => (
      <Form {...playerForm}>
        <form id="playerForm" onSubmit={playerForm.handleSubmit(onPlayerSubmit)} className="space-y-8">
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
          <Button className="flex gap-x-2" variant={"outline"} type="submit" disabled={players.length >= 10}>
            {players.length < 5 ? `Aggiungi` : "Aggiungi giocatore"} <Plus className="size-4" />
          </Button>
        </form>
      </Form>
    ),
    [playerForm, onPlayerSubmit, players.length]
  );

  const renderPlayersList = useMemo(
    () => (
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
    ),
    [players, removePlayer]
  );

  const renderReviewStep = useMemo(() => {
    const teamInfo = teamForm.getValues();
    return (
      <div>
        <Card className="mb-4 p-4">
          <h2 className="text-2xl font-bold tracking-tight">{teamInfo.teamName}</h2>
          <p>
            <strong>Torneo:</strong> {teamInfo.tournamentId}
          </p>
          <p className="flex flex-row gap-x-2 items-center">
            <strong><Palette className="size-4" /></strong> {teamInfo.teamColor}
          </p>
          <p className="flex flex-row gap-x-2 items-center">
            <strong><Phone className="size-4" /></strong> {teamInfo.myNumber}
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
      </div>
    );
  }, [players, teamForm]);

  const renderNavigationButtons = useMemo(
    () => (
      <div className="mt-6 flex justify-between">
        {step > 0 && (
          <Button type="button" onClick={() => setStep((prev) => prev - 1)}>
            Indietro
          </Button>
        )}
        {step === 0 && (
          <div className="w-full flex justify-end">
            <Button type="submit" form="teamForm">
              Avanti <ArrowRight className="size-4" />
            </Button>
          </div>
        )}
        {step === 1 && (
          <Button
            type="button"
            onClick={goToReview}
            disabled={!canProceedToReview}
          >
            Rivedi
          </Button>
        )}
        {step === 2 && (
          <Button
            type="button"
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Invio in corso..." : "Invia"}
          </Button>
        )}
      </div>
    ),
    [step, goToReview, canProceedToReview, handleFinalSubmit, isSubmitting]
  );

  return (
    <div>
      {step === 0 && renderTeamForm}
      {step === 1 && (
        <>
          {renderPlayersList}
          {renderPlayerForm}
        </>
      )}
      {step === 2 && renderReviewStep}
      {renderNavigationButtons}
    </div>
  );
};

export default React.memo(IscrizioniSquadre);
