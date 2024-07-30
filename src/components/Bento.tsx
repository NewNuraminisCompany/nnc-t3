import React from "react";
import { db } from "@/server/db"; // Import your Drizzle ORM setup
import { tornei } from "@/server/db/schema"; // Import the schema
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { desc } from "drizzle-orm";

// Define the structure of a Torneo item
interface Torneo {
  idTorneo: string; // Assuming idTorneo is a string based on the schema
  nome: string | null;
  descrizione: string | null;
  dataInizio: Date; // Assuming dataInizio is a Date object
}

export async function Bento() {
  // Fetch tornei data using Drizzle ORM
  const torneiData = await db
    .select()
    .from(tornei)
    .orderBy(desc(tornei.dataInizio)) // Order by dataInizio descending
    .limit(4); // Limit to 4 results

  if (!torneiData) {
    console.error("Error fetching data");
    return <div>Error loading events</div>;
  }

  const features = torneiData.map((torneo, index) => ({
    name: torneo.nome ?? `Evento ${index + 1}`, // Fallback if nome is null
    description: torneo.descrizione ?? "Descrizione non disponibile",
    href: `/eventi/${torneo.idTorneo}`,
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