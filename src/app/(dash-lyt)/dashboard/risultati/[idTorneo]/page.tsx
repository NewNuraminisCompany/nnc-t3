import { fetchPartite, fetchNomiTutteSquadre } from "@/components/actions";

import { TorneoProvider } from "@/app/context";
import { Card } from "@/components/ui/card";
import { Credenza, CredenzaContent, CredenzaHeader, CredenzaTitle, CredenzaTrigger } from "@/components/ui/credenza";

import { Trophy, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddAvvenimento from "@/components/AddAvvenimento";

// Define the interface for params
interface Params {
  idTorneo: string;
}

const MostraPartite = async ({ params }: { params: Params }) => {
  const { idTorneo } = params;
  console.log("idTorneo: ",idTorneo);
  const data = await fetchPartite(idTorneo);
  
  return (
    <TorneoProvider idTorneo={idTorneo}>
    <div className="container mx-auto w-full pt-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">
          Partite
        </h1>
      </div>

        {data.map((data) => (
        <Card
          key={data.idPartita}
          className="group relative mb-4 overflow-hidden rounded-lg"
        >
          <div className="flex items-center gap-4 p-4">
          <Trophy className="h-12 w-12 rounded-full object-contain" />
            <div className="flex-1">
              <h3 className="text-lg font-bold">{`${data.idSquadra1} vs ${data.idSquadra2}`}</h3>
              <p className="text-muted-foreground">
                {new Date(data.dataOra).toDateString()}
              </p>
            </div>
            <Credenza>
              <CredenzaTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </CredenzaTrigger>
              <CredenzaContent>
                <CredenzaHeader>
                  <CredenzaTitle>Modifica Squadra</CredenzaTitle>
                </CredenzaHeader>
                
                <AddAvvenimento idTorneo={idTorneo} />
              </CredenzaContent>
            </Credenza>
          </div>
        </Card>
        ))}
    </div>
    </TorneoProvider>
  );
};

export default MostraPartite;