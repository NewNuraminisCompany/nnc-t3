"use server";

import { fetchAvvenimenti } from "@/components/actions";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import AddAvvenimento from "@/components/AddAvvenimento";
import { AvvenimentoData } from "@/types/db-types"; // Adjust the import path as needed

interface Params {
  idPartita: string;
  idTorneo: string;
}

const Avvenimenti = async ({ params }: { params: Params }) => {
  const { idPartita, idTorneo } = params;
  const fetchedData = await fetchAvvenimenti(idPartita);
  
  if (fetchedData) {
    const data: AvvenimentoData[] = fetchedData.map(item => ({
      ...item,
      idPartita
    }));

    return (
      <div className="container mx-auto w-full pt-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tight">Avvenimenti</h1>
          <AddAvvenimento idTorneo={idTorneo} idPartita={idPartita} />
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    );
  }
  
  return null; // or some loading/error state
};

export default Avvenimenti;