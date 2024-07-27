import React from "react";
import { createClient } from "@/utils/supabase/server";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";

const supabase = createClient();

// Define the structure of a torneo item
interface Torneo {
  idtorneo: number;
  nome: string | null;
  descrizione: string | null;
  data: string; // Assuming the date is stored as a string in ISO format
}

export async function Bento() {
  const { data: torneos, error } = await supabase
    .from("torneo")
    .select("*")
    .order('datainizio', { ascending: false }) // Order by date, most recent first
    .limit(4) // Limit to 4 results
    .returns<Torneo[]>();

  if (error) {
    console.error("Error fetching data:", error);
    return <div>Error loading events</div>;
  }

  const features = torneos.map((torneo, index) => ({
    name: torneo.nome ?? `Evento ${index + 1}`, // Fallback if nome is null
    description: torneo.descrizione ?? "Descrizione non disponibile",
    href: `/eventi/${torneo.idtorneo}`,
    cta: "Scopri",
    color: "bg-card",
    background: (
      <img
        src=""
        className="absolute -right-20 -top-20 opacity-60"
        alt={torneo.nome || `Evento ${index + 1}`}
      />
    ),
    className:
      index === 0
        ? "lg:row-start-1 lg:row-end-4 lg:col-start-1 lg:col-end-3"
        : `lg:col-start-3 lg:col-end-5 lg:row-start-${index} lg:row-end-${
            index + 1
          }`,
  }));

  return (
    <BentoGrid className="lg:grid-rows-3 w-full">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  );
}
