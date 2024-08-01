import EventListCard from "@/components/EventListCard";
import { db } from "@/server/db"; // Import your Drizzle ORM setup
import { tornei } from "@/server/db/schema"; // Import the schema

export default async function Eventi() {
  // Query all tournaments from the "tornei" table
  const torneoData = await db.select().from(tornei);

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-4xl font-bold tracking-tight my-4">Eventi</h1>
      <div>
        {torneoData.map((event) => (
          <div key={event.idTorneo} className="flex flex-col gap-y-4 w-full">
            <EventListCard
              id={event.idTorneo}
              nome={event.nome}
              descrizione={event.descrizione}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

