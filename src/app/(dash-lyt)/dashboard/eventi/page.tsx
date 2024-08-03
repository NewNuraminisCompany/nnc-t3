import { fetchTorneo } from "@/components/actions";
import { AddTorneo } from "@/components/AddTorneo";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const Eventi = async () => {
  const data = await fetchTorneo();
  return (
    <div className="container mx-auto w-full pt-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">Eventi</h1>
        <AddTorneo />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Eventi;
