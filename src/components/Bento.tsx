import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { db } from "@/server/db";
import { tornei } from "@/server/db/schema";
import { desc } from "drizzle-orm";
import Image from "next/image";

import Vibrant from "node-vibrant"; // Colori

export const imagePlaceholder =
  "https://utfs.io/f/f96b4688-b46e-4c39-bc96-3c463af62aae-1ta2k.jpg";

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

  const features = await Promise.all(
    torneiData.map(async (torneo, index) => {
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
      } else {
        try {
          const palette = await Vibrant.from(imagePlaceholder).getPalette();
          if (palette.Vibrant) {
            dominantColor = palette.Vibrant.hex;
          }
        } catch (error) {
          console.error("Error extracting color from placeholder:", error);
        }
      }
      console.log(torneo.imagePath);
      return {
        name: torneo.nome ?? `Evento ${index + 1}`,
        description: torneo.descrizione ?? "Descrizione non disponibile",
        href: `/eventi/${torneo.idTorneo}`,
        cta: "Scopri",
        color: dominantColor ?? "bg-card",
        background: (
          <Image
            src="/assets/placeholder.png"
            className="absolute -right-20 -top-28 scale-[55%] rounded-lg opacity-80 transition-all duration-300 group-hover:z-20 group-hover:scale-[60%]"
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
    }),
  );

  return (
    <BentoGrid className="w-full lg:grid-rows-3">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  );
}
