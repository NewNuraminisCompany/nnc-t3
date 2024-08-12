"use server";

import { fetchAvvenimenti } from "@/components/actions";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import AddAvvenimento from "@/components/AddAvvenimento";

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
      <div className="container mx-auto w-full pt-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tight">Avvenimenti </h1>
          <AddAvvenimento idTorneo={idTorneo} idPartita={idPartita} />
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    );
  }
};

export default Avvenimenti;
