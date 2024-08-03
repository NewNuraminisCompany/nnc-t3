import { fetchSquadre } from "@/components/actions";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import React from "react";

const data = await fetchSquadre();

const Iscrizioni = async () => {
  return (
    <div className="container mx-auto w-full pt-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">
          Iscrizioni Squadre
        </h1>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Iscrizioni;
