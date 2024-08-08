"use client";

import { cn } from "@/lib/utils";
import { CalendarFold, Home, Trophy, UserRoundPlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/eventi",
    icon: CalendarFold,
    label: "Eventi",
  },
  {
    href: "/risultati",
    icon: Trophy,
    label: "Risultati",
  },
  {
    href: "/iscrizioni",
    icon: UserRoundPlus,
    label: "Iscrizioni",
  },
];

const BottomBar = () => {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="container mx-auto flex h-14 items-center justify-center">
        {navItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "flex flex-1 items-center justify-center text-muted-foreground hover:text-foreground",
              pathname === item.href
                ? "font-semibold text-foreground"
                : "text-muted-foreground",
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="sr-only">{item.label}</span>
          </Link>
        ))}
      </div>
    </footer>
  );
};

export default BottomBar;
