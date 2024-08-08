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
import { Pencil } from "lucide-react";
import Image from "next/image";

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
    return <div>Evento non trovato</div>;
  }

  return (
    <div className="flex w-full flex-col gap-y-4">
      <Card className="my-2 w-full items-center justify-between overflow-scroll rounded-xl">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex w-full justify-end md:w-1/3">
              <Image
                src={event.imagePath ?? "/placeholder-image.jpg"}
                className="rounded-sm object-cover transition-shadow duration-300 hover:shadow-xl"
                alt={event.nome}
              />
            </div>
            <div className="flex flex-col gap-y-2 md:w-2/3">
              <CardTitle className="w-full text-4xl font-bold tracking-tight">
                {event.nome}
              </CardTitle>
              <span className="text-md block text-ellipsis whitespace-nowrap font-semibold text-muted-foreground">
                {event.dataInizio} {" –> "} {event.dataFine}
              </span>
              <CardDescription className="text-md">
                {event.descrizione}
              </CardDescription>
              <Button className="max-w-64 gap-x-2">
                Iscrivi la tua squadra <Pencil className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex w-full flex-col gap-y-4"></CardContent>
      </Card>
    </div>
  );
};

export default Evento;
