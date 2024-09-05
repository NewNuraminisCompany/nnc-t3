"use client";

import React from "react";

import { fetchPartite, fetchTorneo } from "@/components/actions";
import BlurFade from "@/components/magicui/blur-fade";
import { Card, CardContent } from "@/components/ui/card";
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
import { Calendar, Clock, Users } from "lucide-react";

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
          setPartite(
            partiteData?.sort(
              (a, b) =>
                new Date(a.dataOra).getTime() - new Date(b.dataOra).getTime(),
            ) ?? [],
          );
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
      setPartite(
        partiteData?.sort(
          (a, b) =>
            new Date(a.dataOra).getTime() - new Date(b.dataOra).getTime(),
        ) ?? [],
      );
    } catch (error) {
      console.error("Error fetching partite:", error);
      setPartite([]);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4">
        <h1 className="my-6 text-2xl font-bold sm:my-8 sm:text-3xl md:text-4xl">
          Risultati Partite
        </h1>
        <div className="relative mb-4 w-full max-w-[200px] sm:mb-6">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        {[1, 2, 3].map((index) => (
          <BlurFade key={index} duration={0.2} delay={0.25 * index} inView>
            <Card className="mb-4 sm:mb-6">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-6 w-1/4" />
                </div>
                <div className="mt-3 flex justify-center">
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="mt-3 flex justify-between">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        ))}
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="my-6 text-2xl font-bold sm:my-8 sm:text-3xl md:text-4xl">
        Risultati Partite
      </h1>
      <Select onValueChange={handleTorneoChange} value={selectedTorneo}>
        <SelectTrigger className="mb-4 w-full max-w-[200px] sm:mb-6">
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
              <Card className="mb-4 transition-shadow hover:shadow-lg sm:mb-6">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="w-1/3 font-semibold sm:text-base md:text-2xl">
                      {partita.idSquadra1}
                    </div>
                    <div className="w-1/3 text-center text-2xl font-bold md:text-4xl">
                      {partita.risultatoSquadra1} - {partita.risultatoSquadra2}
                    </div>
                    <div className="w-1/3 text-right font-semibold sm:text-base md:text-2xl">
                      {partita.idSquadra2}
                    </div>
                  </div>
                  <div className="mt-2 flex justify-center sm:mt-3">
                    <div className="flex items-center text-xs text-muted-foreground sm:text-sm">
                      <Clock className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      {new Date(partita.dataOra).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground sm:mt-3 sm:text-sm">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      {new Date(partita.dataOra).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      {partita.girone}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </BlurFade>
        ))
      ) : (
        <div className="pt-8 text-center text-muted-foreground sm:pt-16">
          Nessuna partita disponibile.
        </div>
      )}
    </div>
  );
};

export default Risultato;
