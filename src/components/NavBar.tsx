import Link from "next/link";
import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";

const NavBar = async () => {
  const session = await getServerSession();
  return (
    <nav className="fixed w-screen h-[10vh] flex items-center bg-background top-0 z-40">
      <div className="container flex items-center justify-between">
        <Link
          className="flex items-center text-2xl font-bold tracking-tighter gap-x-2 "
          href="/"
        >
          <span className="font-custom tracking-wide text-3xl hover:text-primary">
            NNC
          </span>
        </Link>
        <div className="hidden md:flex flex-row items-center gap-x-5">
          <Button variant={"ghost"}>
            <Link href={"/eventi"}>Eventi</Link>
          </Button>
          <Button variant={"ghost"}>
            <Link href={"/risultati"}>Risultati</Link>
          </Button>
          <Button variant={"ghost"}>
            <Link href={"/iscrizioni"}>Iscrizioni</Link>
          </Button>
        </div>
        <div className="flex items-center gap-x-5">
          {session?.user?.name ? (
            <Button>
              <Link href="/api/auth/signout" >
                Log Out
              </Link>
            </Button>
          ) : (
            <p></p>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

