"use client";

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
import Link from "next/link";
import { useEffect, useState } from "react";

// Define appropriate types
type Torneo = {
  idTorneo: string;
  nome: string;
};

type Partita = {
  idPartita: string;
  idSquadra1: string;
  idSquadra2: string;
  risultatoSquadra1: number;
  risultatoSquadra2: number;
  dataOra: Date;
  girone: string;
};

const Risultato = () => {
  const [selectedTorneo, setSelectedTorneo] = useState<string>("");
  const [torneiList, setTorneiList] = useState<Torneo[]>([]);
  const [partite, setPartite] = useState<Partita[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const torneiData = await fetchTorneo();
        setTorneiList(torneiData ?? []);

        const defaultTorneo = torneiData?.[0]?.idTorneo ?? "";
        if (defaultTorneo) {
          setSelectedTorneo(defaultTorneo);

          const partiteData = await fetchPartite(defaultTorneo);
          // Ordina le partite in base a dataOra
          setPartite(partiteData?.sort((a, b) => new Date(a.dataOra).getTime() - new Date(b.dataOra).getTime()) ?? []);
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

    fetchData().catch((error) => console.error("Unhandled error:", error));
  }, []);

  const handleTorneoChange = async (value: string) => {
    setSelectedTorneo(value);
    try {
      const partiteData = await fetchPartite(value);
      // Ordina le partite in base a dataOra
      setPartite(partiteData?.sort((a, b) => new Date(a.dataOra).getTime() - new Date(b.dataOra).getTime()) ?? []);
    } catch (error) {
      console.error("Error fetching partite:", error);
      setPartite([]);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="my-4 text-4xl font-bold">Risultati Partite</h1>
        <div className="relative mb-4 w-[200px]">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        {[1, 2, 3].map((index) => (
          <BlurFade key={index} duration={0.2} delay={0.25 * index} inView>
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
      <h1 className="my-4 text-4xl font-bold">Risultati Partite</h1>
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
          <BlurFade key={partita.idPartita} delay={0.25} inView>
            <Link href={`/risultati/${partita.idPartita}`}>
              <Card
                key={partita.idPartita}
                className="group relative mb-3 overflow-hidden rounded-lg shadow-md"
              >
                <div className="flex flex-col items-center gap-4 p-4">
                  <span className="text-lg font-bold">
                    {partita.idSquadra1} vs {partita.idSquadra2}
                  </span>
                  <span className="text-4xl font-bold tracking-tight">
                    {partita.risultatoSquadra1} - {partita.risultatoSquadra2}
                  </span>
                  {/* Mostra la data e ora della partita */}
                  <span className="text-sm text-muted-foreground">
                    Data e Ora: {new Date(partita.dataOra).toLocaleString()}
                  </span>
                  {/* Mostra il girone */}
                  <span className="text-sm text-muted-foreground">
                    Girone: {partita.girone}
                  </span>
                </div>
              </Card>
            </Link>
          </BlurFade>
        ))
      ) : (
        <div className="pt-16 text-center text-muted-foreground">
          Nessuna partita disponibile.
        </div>
      )}
    </div>
  );
};

export default Risultato;
