'use server'

import { fetchPartite } from "@/components/actions";
import { AddPartita } from "@/components/AddPartita";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const MostraPartite = async () => {
  const data = await fetchPartite();
  return (
    <div className="container mx-auto w-full pt-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">Partite</h1>
        <AddPartita />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default MostraPartite