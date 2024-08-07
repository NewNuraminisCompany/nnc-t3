
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
import { Dice1 } from "lucide-react";


const MostraTorneo = async ({ params }: { params: { idTorneo: string } }) => {
  if (!params.idTorneo) {
    return <div>ID Torneo non valido</div>;
  }
  const turnaments = await getTornei();
  return(
    <div>ciao</div>
  )

};

export default MostraTorneo;
