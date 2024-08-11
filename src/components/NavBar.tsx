'use client'

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  {
    href: "/eventi",
    label: "Eventi",
  },
  {
    href: "/risultati",
    label: "Risultati",
  },
  {
    href: "/iscrizioni",
    label: "Iscrizioni",
  },
];


const NavBar = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 z-40 flex h-[10vh] w-screen items-center bg-gradient-to-b from-background to-transparent">
      <div className="container flex items-center justify-between">
        <Link
          className="flex items-center gap-x-2 text-2xl font-bold tracking-tighter"
          href="/"
        >
          <span className="font-custom text-3xl tracking-wide hover:text-primary">
            NNC
          </span>
        </Link>
        <div className="hidden flex-row items-center gap-x-5 md:flex">
          {navItems.map((item, index) => (
            <Button
              key={index}
              variant={"ghost"}
              className={cn(pathname === item.href ? "bg-accent" : "")}
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default NavBar;
