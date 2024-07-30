import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/server/db"; // Assume this is where you've set up your Drizzle instance
import { tornei } from "@/server/db/schema"; // Import the schema we just created
import { eq } from "drizzle-orm";
import Link from "next/link";
import React from "react";

const Evento = async ({ params }: { params: { eventID: string } }) => {

  if (!params.eventID) {
    return <div>Invalid event ID</div>;
  }
  const parsedEventID = params.eventID; // Ensure it's the correct type for your database
  const torneoData = await db
    .select()
    .from(tornei)
    .where(eq(tornei.idTorneo, parsedEventID));

  const event = torneoData[0];

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="flex flex-col gap-y-4 w-full">
      <Card className="rounded-xl items-center justify-between overflow-scroll w-full my-2">
        <CardHeader>
          <div className="flex flex-col gap-y-2 w-full">
            <CardTitle className="w-full text-4xl font-bold tracking-tight">
              {event.nome}
            </CardTitle>
            <span className="text-md font-semibold text-muted-foreground whitespace-nowrap text-ellipsis block">
              {event.dataInizio}
              {" –> "}
              {event.dataFine}
            </span>
          </div>
          <CardDescription className="text-md">
            {event.descrizione}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-4 w-full">
        </CardContent>
      </Card>
    </div>
  );
};

export default Evento;

