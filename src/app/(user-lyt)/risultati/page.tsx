'use client'


import { fetchPartite, fetchTorneo } from "@/components/actions";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";

const Risultato = async () => {
  const [selectedTorneo, setSelectedTorneo] = useState(null);

  const torneiList = await fetchTorneo();
  const partite = await fetchPartite();

  const handleTorneoChange = (value: string) => {
    return true;
  };

  
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Risultati Partite</h1>

      <Select onValueChange={handleTorneoChange} value={selectedTorneo}>
        <SelectTrigger className="mb-4 w-[200px]">
          <SelectValue placeholder="Seleziona un torneo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={""}>Tutti i tornei</SelectItem>
          {torneiList.map((torneo) => (
            <SelectItem key={torneo.idTorneo} value={torneo.idTorneo}>
              {torneo.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {partite.map((partita) => (
        <Card
          key={partita.idPartita}
          className="group relative mb-4 overflow-hidden rounded-lg"
        >
          <div className="flex flex-col items-center gap-4 p-4">
            <span className="text-lg font-bold">
              {partita.idSquadra1} vs {partita.idSquadra2}
            </span>
            <span className="text-4xl font-bold tracking-tight">
              {partita.risultatoSquadra1} - {partita.risultatoSquadra2}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Risultato;
