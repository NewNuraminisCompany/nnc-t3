import React from "react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import NewEventCard from "@/components/NewEventCard";
import EditEventCard from "@/components/EditEventCard";

const Dashboard = async () => {
  const session = await getServerSession();

  if (!session?.user?.name) {
    redirect("/");
  }

  return (
    <div className="container mx-auto w-full pt-10">
      <h1 className="mb-6 text-4xl font-bold tracking-tight">Home</h1>
      {/* <div className="w-1/2 p-4">
        <NewEventCard />
      </div>
      <div className="w-1/2 p-4">
        <EditEventCard />
      </div> */}
      
    </div>
  );
};

export default Dashboard;
