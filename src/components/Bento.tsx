import React from "react";
import { db } from "@/server/db";
import { tornei } from "@/server/db/schema";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { desc } from "drizzle-orm";
import Image from 'next/image'

import Vibrant from 'node-vibrant'; // Colori

export async function Bento() {
  // Fetch tornei data using Drizzle ORM
  const torneiData = await db
    .select()
    .from(tornei)
    .orderBy(desc(tornei.dataInizio))
    .limit(4);

  if (!torneiData || torneiData.length === 0) {
    console.error("Error fetching data or no data available");
    return <div>Error loading events</div>;
  }

  const features = await Promise.all(torneiData.map(async (torneo, index) => {
    let dominantColor = "bg-card"; // Default color

    if (torneo.imagePath) {
      try {
        const palette = await Vibrant.from(torneo.imagePath).getPalette();
        if (palette.Vibrant) {
          dominantColor = palette.Vibrant.hex;
        }
      } catch (error) {
        console.error("Error extracting color:", error);
      }
    }

    return {
        name: torneo.nome ?? `Evento ${index + 1}`,
        description: torneo.descrizione ?? "Descrizione non disponibile",
        href: `/eventi/${torneo.idTorneo}`,
        cta: "Scopri",
        color: dominantColor ?? "bg-card",
        background: (
            <Image
                src={torneo.imagePath ?? "/placeholder-image.jpg"}
                className="absolute -right-20 -top-20 opacity-60 scale-50 rounded-lg"
                width={1080}
                height={1350}
                alt={torneo.nome || `Evento ${index + 1}`}
            />
        ),
        className:
            index === 0
                ? "lg:row-start-1 lg:row-end-4 lg:col-start-1 lg:col-end-3"
                : `lg:col-start-3 lg:col-end-5 lg:row-start-${index} lg:row-end-${index + 1}`,
    };
}));

  return (
    <BentoGrid className="lg:grid-rows-3 w-full">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  );
}