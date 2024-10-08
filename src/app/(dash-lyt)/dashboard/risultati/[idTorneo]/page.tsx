import { fetchPartite } from "@/components/actions";

import { TorneoProvider } from "@/app/context";
import { Card } from "@/components/ui/card";
import {
  Credenza,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";

import { Trophy, Edit, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Define the interface for params
interface Params {
  idTorneo: string;
}

const MostraPartite = async ({ params }: { params: Params }) => {
  const { idTorneo } = params;
  console.log("idTorneo: ", idTorneo);
  const data = await fetchPartite(idTorneo);
  if (data) {
    return (
      <TorneoProvider idTorneo={idTorneo}>
        <div className="container mx-auto w-full pt-10">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-4xl font-bold tracking-tight">Partite</h1>
          </div>

          {data.map((data) => (
            <Card
              key={data.idPartita}
              className="group relative mb-4 overflow-hidden rounded-lg"
            >
              <div className="flex items-center gap-4 p-4">
                <Trophy className="size-10 object-contain" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{`${data.idSquadra1} vs ${data.idSquadra2}`}</h3>
                  <p className="text-muted-foreground">
                    {new Date(data.dataOra).toDateString()}
                  </p>
                </div>
                <div className="flex-1 text-center">
                  <h3 className="text-lg">{`Risultato`}</h3>
                  <p className="text-muted-foreground">
                    {data.risultatoSquadra1} : {data.risultatoSquadra2}
                  </p>
                </div>
                <div className="flex-1 text-center">
                  <h3 className="text-lg">{`Girone`}</h3>
                  <p className="text-muted-foreground">{data.girone}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Link
                    href={`/dashboard/risultati/${idTorneo}/${data.idPartita}`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>

              </div>
            </Card>
          ))}
        </div>
      </TorneoProvider>
    );
  }
};

export default MostraPartite;
