import BlurFade from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/server/db";
import { tornei } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { Calendar, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Evento = async ({ params }: { params: { eventID: string } }) => {
  if (!params.eventID) {
    return <div>Invalid event ID</div>;
  }

  const parsedEventID = params.eventID;
  const torneoData = await db
    .select()
    .from(tornei)
    .where(eq(tornei.idTorneo, parsedEventID));

  const event = torneoData[0];

  if (!event) {
    return <div>Evento non trovato</div>;
  }

  const imagePlaceholder =
    "https://utfs.io/f/f96b4688-b46e-4c39-bc96-3c463af62aae-1ta2k.jpg";

  return (
    <div className="absolute left-0 right-0 top-0 min-h-screen">
      {/* Full-height image container */}
      <div className="absolute inset-0 -top-20 md:-top-16 z-0 max-h-[32rem] w-full">
        <Image
          src={event.imagePath ?? imagePlaceholder}
          layout="fill"
          objectFit="cover"
          alt={event.nome}
          className="inset-0"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background" />
      </div>

      {/* Content container */}
      <div className="container z-10 mt-16 flex min-h-screen flex-col pt-16 sm:pt-24">
        <div className="flex-grow py-8">
          <BlurFade delay={0.25} inView>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground mix-blend-difference shadow-sm">
              {event.nome}
            </h1>
          </BlurFade>
          <BlurFade delay={0.25 * 2} inView>
            <Card className="mt-8 bg-background/80 backdrop-blur-sm">
              <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {event.dataInizio} {" –> "} {event.dataFine}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{event.descrizione}</p>
                </div>

                <div className="flex flex-col justify-end space-y-4">
                  {event.stato === "programmato" ? (
                    <Button className="w-full sm:w-auto">
                      <Link
                        className="flex items-center"
                        href={`/iscrizioni?torneoId=${event.idTorneo}`}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Iscrivi la tua squadra
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      disabled
                      className="w-full sm:w-auto"
                    >
                      Le iscrizioni sono chiuse
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        </div>
      </div>
    </div>
  );
};

export default Evento;
