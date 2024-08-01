import React from "react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const session = await getServerSession();

  if (!session?.user?.name) {
    redirect("/");
  }

  return (
    <div className="container mx-auto w-full pt-10">
      <h1 className="mb-6 text-4xl font-bold tracking-tight">Home</h1>
    </div>
  );
};

export default Dashboard;
