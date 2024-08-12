"use server";

import { fetchAvvenimenti, fetchPartite, fetchTorneo } from "@/components/actions";
import { columns } from "../../../(dash-lyt)/dashboard/risultati/[idTorneo]/[idPartita]/columns";
import { DataTable } from "../../../(dash-lyt)/dashboard/risultati/[idTorneo]/[idPartita]/data-table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

interface Params {
  idPartita: string;
  idTorneo: string;
}



const Avvenimenti = async ({ params }: { params: Params }) => {
  const { idPartita } = params;
  const { idTorneo } = params;
  console.log("idPartita: ", idPartita);
  console.log("idTorneo: ", idTorneo);
  const data = await fetchAvvenimenti(idPartita);


  if (data) {
    return (
      <div>
        <h1 className="text-4xl font-bold my-4">Risultati Partite</h1>
        
        <DataTable columns={columns} data={data} />
      </div>
    );
  }
};

export default Avvenimenti;
