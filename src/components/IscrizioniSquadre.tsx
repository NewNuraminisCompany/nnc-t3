'use client'

import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const codiceFiscaleRegex = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/;

const teamFormSchema = z.object({
  teamName: z.string().min(1, "Inserire il nome della squadra").max(255),
  teamColor: z.string().min(1, "Inserire il colore della squadra").max(255),
  myNumber: z.string().regex(/^\+?[0-9]{6,14}$/, "Inserire un numero di telefono della squadra"),
});

const playerFormSchema = z.object({
  playerName: z.string().min(1, "Inserire il nome del giocatore").max(255),
  playerSurname: z.string().min(1, "Inserire il cognome del giocatore").max(255),
  playerID: z.string().regex(codiceFiscaleRegex, "Codice fiscale non valido"),
  playerDateOfBirth: z.date().refine(date => date <= new Date(), {
    message: "La data di nascita non può essere futura",
  }),
});

type TeamFormData = z.infer<typeof teamFormSchema>;
type PlayerFormData = z.infer<typeof playerFormSchema>;

type Player = PlayerFormData;

export default function IscrizioniSquadre() {
  const [step, setStep] = useState(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [teamInfo, setTeamInfo] = useState<TeamFormData | null>(null);
  
  const teamForm = useForm<TeamFormData>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      teamName: "",
      teamColor: "",
      myNumber: "",
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

  return (
    <div>
      {step === 0 && (
        <Form {...teamForm}>
          <form onSubmit={teamForm.handleSubmit(onTeamSubmit)} className="space-y-8">
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
            <Button type="submit">Avanti</Button>
          </form>
        </Form>
      )}

      {step === 1 && (
        <Form {...playerForm}>
          <form onSubmit={playerForm.handleSubmit(onPlayerSubmit)} className="space-y-8">
            <div className="mb-4">
              <h3 className="text-lg font-bold">Lista Giocatori ({players.length}/10)</h3>
              <ul>
                {players.map((player, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{player.playerName} {player.playerSurname}</span>
                    {players.length > 5 && (
                      <Button type="button" onClick={() => removePlayer(index)} variant="destructive" size="sm">
                        Rimuovi
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
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
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Seleziona una data</span>}
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
                {players.length < 5 ? `Aggiungi giocatore (minimo ${5 - players.length} richiesti)` : 'Aggiungi giocatore'}
              </Button>
              <Button type="button" onClick={goToReview} disabled={!canProceedToReview}>
                Rivedi
              </Button>
            </div>
          </form>
        </Form>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold">Rivedi e Invia</h2>
          <p><strong>Nome squadra:</strong> {teamInfo?.teamName}</p>
          <p><strong>Colore squadra:</strong> {teamInfo?.teamColor}</p>
          <p><strong>Telefono squadra:</strong> {teamInfo?.myNumber}</p>
          {players.map((player, index) => (
            <div key={index} className="border p-4 mb-4">
              <h3 className="text-lg font-bold">Giocatore {index + 1}</h3>
              <p><strong>Nome:</strong> {player.playerName}</p>
              <p><strong>Cognome:</strong> {player.playerSurname}</p>
              <p><strong>Codice Fiscale:</strong> {player.playerID}</p>
              <p><strong>Data di nascita:</strong> {format(player.playerDateOfBirth, "PPP")}</p>
            </div>
          ))}
          <Button type="button" onClick={() => console.log({ team: teamInfo, players })}>
            Invia
          </Button>
        </div>
      )}

      {step > 0 && (
        <Button type="button" onClick={() => setStep(prev => prev - 1)}>
          Indietro
        </Button>
      )}
    </div>
  );
}
