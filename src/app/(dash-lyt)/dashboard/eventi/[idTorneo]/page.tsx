import { fetchPartite, fetchNomiTutteSquadre } from "@/components/actions";
import { AddPartita } from "@/components/AddPartita";
import { columns } from "./columns"; // Ensure the import path and name are correct
import { DataTable } from "./data-table";
import { TorneoProvider } from "@/app/context";

// Define the interface for params
interface Params {
  idTorneo: string;
}

const MostraPartite = async ({ params }: { params: Params }) => {
  const { idTorneo } = params;
  const data = await fetchPartite(idTorneo);
  const squadre = await fetchNomiTutteSquadre(idTorneo);
  
  return (
    <TorneoProvider idTorneo={idTorneo}>
    <div className="container mx-auto w-full pt-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">Partite</h1>
        <AddPartita nomi_squadre={squadre} />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
    </TorneoProvider>
  );
};

export default MostraPartite;