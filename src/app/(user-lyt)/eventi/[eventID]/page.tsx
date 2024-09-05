import BlurFade from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/server/db";
import { tornei, squadre } from "@/server/db/schema";
import { count, eq } from "drizzle-orm";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Info,
  Trophy,
  Pencil,
  Medal,
  Shield,
  Award,
} from "lucide-react";
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

  const teamCountData = await db
    .select({ teamCount: count() })
    .from(squadre)
    .where(eq(squadre.idTorneo, parsedEventID));

  const teamCount = teamCountData[0]?.teamCount ?? "TBA";

  const imagePlaceholder =
    "https://utfs.io/f/f96b4688-b46e-4c39-bc96-3c463af62aae-1ta2k.jpg";

  // Function to format date in Italian format
  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Format dates
  const startDate = formatDate(event.dataInizio);
  const endDate = formatDate(event.dataFine);

  // Determine date display
  const dateDisplay =
    startDate === endDate ? startDate : `${startDate} - ${endDate}`;

  return (
    <div className="py-2">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{event.nome}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 justify-between gap-8 md:grid-cols-2">
          <div className="relative h-[300px] w-full md:h-[400px]">
            <Image
              src={event.imagePath ?? imagePlaceholder}
              layout="fill"
              objectFit="cover"
              alt={event.nome}
              className="rounded-sm"
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">{dateDisplay}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span>{teamCount ?? "TBA"} squadre</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>{"Orario TBA"}</span>
            </div>
            <div className="pt-4">
              {event.stato === "programmato" ? (
                <Button className="w-full">
                  <Link
                    className="flex w-full items-center justify-center"
                    href={`/iscrizioni?torneoId=${event.idTorneo}`}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Iscrivi la tua squadra
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" disabled className="w-full">
                  Le iscrizioni sono chiuse
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="mr-2 h-5 w-5" />
              Descrizione
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{event.descrizione}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="mr-2 h-5 w-5" />
              Premi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="flex items-center font-semibold">
                  <Medal className="mr-2 h-5 w-5 text-yellow-500" />
                  Trofei Squadre
                </h3>
                <ul className="ml-5 mt-2 list-inside list-disc">
                  <li>Trofeo 1° Classificato</li>
                  <li>Trofeo 2° Classificato</li>
                  <li>Trofeo 3° Classificato</li>
                </ul>
              </div>
              <div>
                <h3 className="flex items-center font-semibold">
                  <Award className="mr-2 h-5 w-5 text-orange-500" />
                  Premio Individuale
                </h3>
                <p className="ml-7">Trofeo Capocannoniere</p>
              </div>
              <div>
                <h3 className="flex items-center font-semibold">
                  <Shield className="mr-2 h-5 w-5 text-blue-500" />
                  Premio Individuale
                </h3>
                <p className="ml-7">Trofeo Miglior Portiere</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Evento;
