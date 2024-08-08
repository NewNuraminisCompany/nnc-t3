import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { fetchTorneo } from "@/components/actions";

const Risultati = async () => {
  const session = await getServerSession();
  const data = await fetchTorneo();
  if (!session?.user?.name) {
    redirect("/");
  }

  return (
    <div className="container mx-auto w-full pt-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">Risultati</h1>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Risultati;

