'use client'

import { fetchPartite, fetchTorneo } from "@/components/actions";
import BlurFade from "@/components/magicui/blur-fade";
import { Card } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";


const Risultato = () => {
  const [selectedTorneo, setSelectedTorneo] = useState<string>("");
  const [torneiList, setTorneiList] = useState<any[]>([]);
  const [partite, setPartite] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
      const fetchData = async () => {
        try {
          const torneiData = await fetchTorneo();
          setTorneiList(torneiData || []);

          // Ensure torneiData is defined and not empty
          const defaultTorneo = torneiData?.[0]?.idTorneo || "";

          if (defaultTorneo) {
            setSelectedTorneo(defaultTorneo);

            // Fetch partite for the default torneo
            const partiteData = await fetchPartite(defaultTorneo);
            setPartite(partiteData || []);
          } else {
            setPartite([]);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setTorneiList([]);
          setPartite([]);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, []);


  const handleTorneoChange = async (value: string) => {
    setSelectedTorneo(value);
    const partiteData = await fetchPartite(value);
    setPartite(partiteData || []);
  };

  // Loading state
  if (loading) {
    return (
      <div>
        <h1 className="text-4xl font-bold my-4">Risultati Partite</h1>
          <div className="relative mb-4 w-[200px]">
                <Skeleton className="h-10 w-full rounded-md" />
          </div>
        {[1, 2, 3].map((index) => (
          <BlurFade duration={0.2} delay={0.25 * index} inView>
            <Card
              key={index}
              className="group relative mb-4 overflow-hidden rounded-lg"
            >
              <div className="flex flex-col items-center gap-4 p-4">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-10 w-1/3" />
                </div>
            </Card>
          </BlurFade>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold my-4">Risultati Partite</h1>
      <Select onValueChange={handleTorneoChange} value={selectedTorneo}>
        <SelectTrigger className="mb-4 w-[200px]">
          <SelectValue placeholder="Seleziona un torneo" />
        </SelectTrigger>
        <SelectContent>
          {torneiList.map((torneo) => (
            <SelectItem key={torneo.idTorneo} value={torneo.idTorneo}>
              {torneo.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {partite.length > 0 ? (
        partite.map((partita) => (
          <BlurFade delay={0.25} inView>
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
          </BlurFade>
        ))
      ) : (
        <div className="text-center pt-16 text-muted-foreground">
          Nessuna partita disponibile.
        </div>
      )}
    </div>
  );
};

export default Risultato;
