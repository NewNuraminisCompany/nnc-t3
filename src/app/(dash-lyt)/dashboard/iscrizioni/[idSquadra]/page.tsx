
import { fetchPlayers } from "@/components/actions";
import EditPlayer from "@/components/EditPlayer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Credenza,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";

import { CircleUser, Edit } from "lucide-react";

const Dettagli = async ({ params }: { params: { idSquadra: string } }) => {
  if (!params.idSquadra) {
    return <div>ID Squadra non valido</div>;
  }

  const players = await fetchPlayers(params.idSquadra);

  return (
    <div className="container mx-auto w-full pt-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">
          Dettagli di {players[0]?.squadra.nome ?? params.idSquadra}
        </h1>
      </div>
      {players.map((player) => (
        <Card
          key={player.idGiocatore}
          className="group relative mb-4 overflow-hidden rounded-lg"
        >
          <div className="flex items-center gap-4 p-4">
            <CircleUser className="h-12 w-12 rounded-full object-contain" />
            <div className="flex-1">
              <h3 className="text-lg font-bold">{`${player.nome} ${player.cognome}`}</h3>
              <p className="text-muted-foreground">
                {new Date(player.dataNascita).toLocaleDateString()}
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
                <EditPlayer player={player} />
              </CredenzaContent>
            </Credenza>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Dettagli;
