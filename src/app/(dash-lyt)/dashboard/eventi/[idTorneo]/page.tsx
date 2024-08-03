
import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { getTornei } from "@/components/actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";


const MostraTorneo = async ({ params }: { params: { idTorneo: string } }) => {
  if (!params.idTorneo) {
    return <div>ID Torneo non valido</div>;
  }
  const turnaments = await getTornei();


  return (
    <div className="container mx-auto w-full pt-10">
      <h1 className="text-4xl font-bold tracking-tight">
        Dettagli di {turnaments[0]?.nome ?? params.idTorneo}
      </h1>
      <div>
        <Card className="my-2 w-full items-center justify-between overflow-scroll rounded-xl">
          <CardHeader>
            <CardTitle>{"Informazioni"}</CardTitle>
            <CardDescription>{""}</CardDescription>
          </CardHeader>
          <CardContent className="items-center">
            <Button>
              <Link href={``}>Modifica</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className="my-2 w-full items-center justify-between overflow-scroll rounded-xl">
          <CardHeader>
            <CardTitle>{"Partite"}</CardTitle>
            <CardDescription>{""}</CardDescription>
          </CardHeader>
          <CardContent className="items-center">
            <Button>
              <Link href={``}>Modifica</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <div>
      <Card className="my-2 w-full items-center justify-between overflow-scroll rounded-xl">
        <CardHeader>
          <CardTitle>{"Gironi"}</CardTitle>
          <CardDescription>{""}</CardDescription>
        </CardHeader>
        <CardContent className="items-center">
          <Button>
            <Link href={``}>Modifica</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
    <div>
        <Card className="my-2 w-full items-center justify-between overflow-scroll rounded-xl">
          <CardHeader>
            <CardTitle>{"Classifiche"}</CardTitle>
            <CardDescription>{""}</CardDescription>
          </CardHeader>
          <CardContent className="items-center">
            <Button>
              <Link href={``}>Modifica</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MostraTorneo;
