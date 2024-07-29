"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { DatePicker } from "./DatePicker";

// Define schemas
const TeamSchema = z.object({
  teamName: z.string().min(2, { message: "Team name must be at least 2 characters." }),
  teamColor: z.string().min(2, { message: "Team color must be at least 2 characters." }),
  teamPhone: z.string().regex(/^\+?[0-9]{10,14}$/, { message: "Please enter a valid phone number." }),
});

const PlayerSchema = z.object({
  playerName: z.string().min(2, { message: "Player name must be at least 2 characters." }),
  playerSurname: z.string().min(2, { message: "Player surname must be at least 2 characters." }),
  playerID: z.string().length(16, { message: "Player ID must be exactly 16 characters." }),
  dateOfBirth: z.date({
    required_error: "Please select a date of birth.",
    invalid_type_error: "That's not a valid date!",
  }),
});

const RegistrationSchema = z.object({
  team: TeamSchema,
  players: z.array(PlayerSchema).min(5, { message: "You must add at least 5 players." }).max(10, { message: "You can add a maximum of 10 players." }),
});

// PlayerCard component
const PlayerCard = ({ player, onRemove }: { player: z.infer<typeof PlayerSchema>; onRemove: () => void }) => (
  <Card>
    <CardContent className="flex justify-between items-center p-4">
      <div>
        <p className="font-semibold">{player.playerName} {player.playerSurname}</p>
        <p>ID: {player.playerID}</p>
        <p>DoB: {player.dateOfBirth.toLocaleDateString()}</p>
      </div>
      <Button variant="ghost" size="icon" onClick={onRemove}>
        <X className="h-4 w-4" />
      </Button>
    </CardContent>
  </Card>
);

// Main form component
const SoccerTeamRegistrationForm = ({ onSubmit }: { onSubmit: (data: z.infer<typeof RegistrationSchema>) => void }) => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(33);
  const [players, setPlayers] = useState<z.infer<typeof PlayerSchema>[]>([]);
  const [newPlayer, setNewPlayer] = useState<z.infer<typeof PlayerSchema>>({
    playerName: "",
    playerSurname: "",
    playerID: "",
    dateOfBirth: new Date()
  });
  const [newPlayerErrors, setNewPlayerErrors] = useState<{ [key in keyof z.infer<typeof PlayerSchema>]: string }>({
    playerName: "",
    playerSurname: "",
    playerID: "",
    dateOfBirth: ""
  });

  const form = useForm<z.infer<typeof RegistrationSchema>>({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      team: { teamName: "", teamColor: "", teamPhone: "" },
      players: [],
    },
  });

  const nextStep = () => {
    if (step === 1) {
      form.trigger(['team.teamName', 'team.teamColor', 'team.teamPhone']).then((isValid) => {
        if (isValid) {
          setStep(2);
          setProgress(66);
        }
      });
    } else if (step === 2) {
      if (players.length >= 5) {
        setStep(3);
        setProgress(100);
      } else {
        toast({
          title: "Error",
          description: "You must add at least 5 players before proceeding.",
          variant: "destructive",
        });
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setProgress(progress - 33);
    }
  };

  const validateNewPlayer = () => {
    const errors: { [key in keyof z.infer<typeof PlayerSchema>]: string } = {
      playerName: "",
      playerSurname: "",
      playerID: "",
      dateOfBirth: ""
    };
    let isValid = true;

    if (newPlayer.playerName.length < 2) {
      errors.playerName = "Player name must be at least 2 characters.";
      isValid = false;
    }
    if (newPlayer.playerSurname.length < 2) {
      errors.playerSurname = "Player surname must be at least 2 characters.";
      isValid = false;
    }
    if (newPlayer.playerID.length !== 16) {
      errors.playerID = "Player ID must be exactly 16 characters.";
      isValid = false;
    }
    if (!/^\d{2}-\d{2}-\d{4}$/.test(newPlayer.dateOfBirth)) {
      errors.dateOfBirth = "Date of birth must be in DD-MM-YYYY format.";
      isValid = false;
    }

    setNewPlayerErrors(errors);
    return isValid;
  };

  const addPlayer = () => {
    if (validateNewPlayer()) {
      if (players.length < 10) {
        const updatedPlayers = [...players, newPlayer];
        setPlayers(updatedPlayers);
        form.setValue('players', updatedPlayers);
        setNewPlayer({
          playerName: "",
          playerSurname: "",
          playerID: "",
          dateOfBirth: new Date()
        });
        setNewPlayerErrors({
          playerName: "",
          playerSurname: "",
          playerID: "",
          dateOfBirth: ""
        });
      } else {
        toast({
          title: "Error",
          description: "You can add a maximum of 10 players.",
          variant: "destructive",
        });
      }
    }
  };

  const removePlayer = (index: number) => {
    const updatedPlayers = players.filter((_, i) => i !== index);
    setPlayers(updatedPlayers);
    form.setValue('players', updatedPlayers);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Progress value={progress} className="w-full" />

        {step === 1 && (
          <>
            <FormField
              control={form.control}
              name="team.teamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome squadra</FormLabel>
                  <FormControl>
                    <Input placeholder="Inserisci il nome della squadra" {...field} />
                  </FormControl>
                  <FormDescription>Non inserire nomi offensivi.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="team.teamColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Colore squadra</FormLabel>
                  <FormControl>
                    <Input placeholder="Inserisci il colore della squadra" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="team.teamPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefono squadra</FormLabel>
                  <FormControl>
                    <Input placeholder="Inserisci il numero di telefono della squadra" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {step === 2 && (
          <>
            <div className="space-y-4">
              <FormItem>
                <FormLabel>Nome giocatore</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Inserisci il nome del giocatore"
                    value={newPlayer.playerName}
                    onChange={(e) => setNewPlayer({ ...newPlayer, playerName: e.target.value })}
                  />
                </FormControl>
                {newPlayerErrors.playerName && <p className="text-sm text-red-500">{newPlayerErrors.playerName}</p>}
              </FormItem>
              <FormItem>
                <FormLabel>Cognome giocatore</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Inserisci il cognome del giocatore"
                    value={newPlayer.playerSurname}
                    onChange={(e) => setNewPlayer({ ...newPlayer, playerSurname: e.target.value })}
                  />
                </FormControl>
                {newPlayerErrors.playerSurname && <p className="text-sm text-red-500">{newPlayerErrors.playerSurname}</p>}
              </FormItem>
              <FormItem>
                <FormLabel>C.F. giocatore</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Inserisci il codice fiscale del giocatore"
                    value={newPlayer.playerID}
                    onChange={(e) => setNewPlayer({ ...newPlayer, playerID: e.target.value })}
                    maxLength={16}
                  />
                </FormControl>
                {newPlayerErrors.playerID && <p className="text-sm text-red-500">{newPlayerErrors.playerID}</p>}
              </FormItem>
              <FormItem>
                <FormLabel>Data di nascita</FormLabel>
                <FormControl>
                  <DatePicker
                    selected={newPlayer.dateOfBirth}
                    onSelect={(date) => setNewPlayer({ ...newPlayer, dateOfBirth: date || new Date() })}
                  />
                </FormControl>
                {newPlayerErrors.dateOfBirth && <p className="text-sm text-red-500">{newPlayerErrors.dateOfBirth}</p>}
              </FormItem>
              <Button type="button" onClick={addPlayer} disabled={players.length >= 10}>
                Aggiungi Giocatore
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {players.map((player, index) => (
                <PlayerCard
                  key={index}
                  player={player}
                  onRemove={() => removePlayer(index)}
                />
              ))}
            </div>

            {players.length < 5 && (
              <p className="text-sm text-red-500">Devi aggiungere almeno 5 giocatori.</p>
            )}
          </>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold">Confirmation</h2>
            <p>Team Name: {form.getValues().team.teamName}</p>
            <p>Team Color: {form.getValues().team.teamColor}</p>
            <p>Team Phone: {form.getValues().team.teamPhone}</p>
            <h3 className="text-xl font-semibold mt-4">Players:</h3>
            <ul>
              {players.map((player, index) => (
                <li key={index}>
                {player.playerName} {player.playerSurname} - ID: {player.playerID}, DoB: {player.dateOfBirth.toLocaleDateString()}
              </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-between">
          {step > 1 && <Button type="button" onClick={prevStep}>Previous</Button>}
          {step < 3 ? (
            <Button type="button" onClick={nextStep}>Next</Button>
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </div>
      </form>
    </Form>
  );
};

// Parent component
export default function IscrizioniSquadre() {
  const handleSubmit = async (data: z.infer<typeof RegistrationSchema>) => {
    try {
      // Here we should interact with the database to save the data
      // Assuming we have set up Drizzle ORM and the necessary schema
      const teamId = await db.insert('squadre').values({
        idSquadra: generateUUID(), // Ensure this is a unique identifier
        nome: data.team.teamName,
        colore: data.team.teamColor,
        cellulare: data.team.teamPhone,
      }).returning('idSquadra');

      await Promise.all(data.players.map((player) =>
        db.insert('giocatori').values({
          cf: player.playerID,
          nome: player.playerName,
          cognome: player.playerSurname,
          dataNascita: player.dateOfBirth,
          idSquadra: teamId,
        })
      ));

      toast({
        title: "Registration Successful!",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    } catch (error) {
      console.error("Error saving to database:", error);
      toast({
        title: "Registration Failed!",
        description: "There was an error saving the registration data.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="flex flex-col w-full">
      <CardContent className="pt-8">
        <SoccerTeamRegistrationForm onSubmit={handleSubmit} />
      </CardContent>
    </Card>
  );
}

