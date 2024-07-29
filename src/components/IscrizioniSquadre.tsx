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

const formSchema = z.object({
  teamName: z.string().min(1, "Nome Squadra is required").max(255),
  teamColor: z.string().min(1, "Colore is required").max(255),
  myNumber: z.string().regex(/^\+?[0-9]{6,14}$/, "Invalid phone number format"),
  playerName: z.string().min(1, "Nome is required").max(255),
  playerSurname: z.string().min(1, "Cognome is required").max(255),
  playerID: z.string().regex(codiceFiscaleRegex, "Invalid Codice Fiscale format"),
  playerDateOfBirth: z.date().refine(date => date <= new Date(), {
    message: "Date of birth cannot be in the future",
  }),
});

type FormData = z.infer<typeof formSchema>;

type Player = {
  playerName: string;
  playerSurname: string;
  playerID: string;
  playerDateOfBirth: Date;
};

export default function IscrizioniSquadre() {
  const [step, setStep] = useState(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: "",
      teamColor: "",
      myNumber: "",
      playerName: "",
      playerSurname: "",
      playerID: "",
      playerDateOfBirth: new Date(),
    },
    mode: "all",
  });

  const onSubmit: SubmitHandler<FormData> = (values) => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      const newPlayer = {
        playerName: values.playerName,
        playerSurname: values.playerSurname,
        playerID: values.playerID,
        playerDateOfBirth: values.playerDateOfBirth,
      };
      setPlayers([...players, newPlayer]);
      form.reset({
        playerName: "",
        playerSurname: "",
        playerID: "",
        playerDateOfBirth: new Date(),
      });
    }
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {step === 0 && (
          <>
            <FormField
              control={form.control}
              name="teamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Squadra</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome Squadra" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="teamColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Colore</FormLabel>
                  <FormControl>
                    <Input placeholder="Colore" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="myNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefono Squadra</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Numero di Telefono" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {step === 1 && (
          <>
            <div className="mb-4">
              <h3 className="text-lg font-bold">Players List ({players.length}/10)</h3>
              <ul>
                {players.map((player, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{player.playerName} {player.playerSurname}</span>
                    {players.length > 5 && (
                      <Button type="button" onClick={() => removePlayer(index)} variant="destructive" size="sm">
                        Remove
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <FormField
              control={form.control}
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
              control={form.control}
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
              control={form.control}
              name="playerID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>C.F. Giocatore</FormLabel>
                  <FormControl>
                    <Input placeholder="Codice Fiscale" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
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
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
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
          </>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold">Review & Submit</h2>
            <p><strong>Nome Squadra:</strong> {form.getValues("teamName")}</p>
            <p><strong>Colore:</strong> {form.getValues("teamColor")}</p>
            <p><strong>Telefono Squadra:</strong> {form.getValues("myNumber")}</p>
            {players.map((player, index) => (
              <div key={index} className="border p-4 mb-4">
                <h3 className="text-lg font-bold">Player {index + 1}</h3>
                <p><strong>Nome:</strong> {player.playerName}</p>
                <p><strong>Cognome:</strong> {player.playerSurname}</p>
                <p><strong>C.F. Giocatore:</strong> {player.playerID}</p>
                <p><strong>Data di nascita:</strong> {format(player.playerDateOfBirth, "PPP")}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between">
          {step > 0 && (
            <Button type="button" onClick={() => setStep(prev => prev - 1)}>
              Back
            </Button>
          )}
          {step === 0 && (
            <Button type="submit" onClick={() => setStep(prev => prev + 1)}>Next</Button>
          )}
          {step === 1 && (
            <>
              <Button type="submit" disabled={players.length >= 10}>
                {players.length < 5 ? `Add Player (${5 - players.length} more required)` : 'Add Player'}
              </Button>
              <Button type="button" onClick={goToReview} disabled={!canProceedToReview}>
                Review
              </Button>
            </>
          )}
          {step === 2 && (
            <Button type="button" onClick={() => console.log({ team: form.getValues(), players })}>
              Submit
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}