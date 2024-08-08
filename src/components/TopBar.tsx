'use client'

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  CalendarFold,
  Home,
  LogOut,
  PanelLeft,
  Trophy,
  UserRoundPlus,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/dashboard",
    icon: Home,
    label: "Home",
  },
  {
    href: "/dashboard/eventi",
    icon: CalendarFold,
    label: "Eventi",
  },
  {
    href: "/dashboard/iscrizioni",
    icon: UserRoundPlus,
    label: "Iscrizioni",
  },
  {
    href: "/dashboard/risultati",
    icon: Trophy,
    label: "Risultati",
  },
];


const TopBar = () => {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 justify-between">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 pt-10 text-lg font-medium">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
                  pathname === item.href
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <Link
          href="/api/auth/signout"
          className="md:hidden flex items-center gap-4 px-2.5 text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
          Esci
        </Link>
    </header>
  );
};

export default TopBar;
