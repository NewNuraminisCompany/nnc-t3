import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/server/db"; // Assume this is where you've set up your Drizzle instance
import { torneo } from "@/server/db/schema"; // Import the schema we just created
import { eq } from "drizzle-orm";
import Link from "next/link";
import React from "react";

const Evento = async ({ params }: { params: { eventId: string } }) => {
  const torneoData = await db.select().from(torneo).where(eq(torneo.idtorneo, parseInt(params.eventId)));
  const event = torneoData[0];

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="flex flex-col gap-y-4 w-full ">
      <Card className="rounded-xl items-center justify-between overflow-scroll w-full my-2 ">
        <CardHeader>
          <div className="flex flex-col gap-y-2 w-full">
            <CardTitle className="w-full text-4xl font-bold tracking-tight">
              {event.nome}
            </CardTitle>
            <span className="text-md font-semibold text-muted-foreground whitespace-nowrap text-ellipsis block">
              {event.datainizio?.toLocaleDateString()}
              {" –> "}
              {event.datafine?.toLocaleDateString()}
            </span>
          </div>
          <CardDescription className="text-md">
            {event.descrizione}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-4 w-full ">
          <Button>
            <Link href={`/eventi/${event.idtorneo}`}>Scopri</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Evento;
