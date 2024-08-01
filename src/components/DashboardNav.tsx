"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CalendarFold, Home, LogOut, UserRoundPlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Assuming classnames library is used for conditional classes

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
    href: "/api/auth/signout",
    icon: LogOut,
    label: "Esci"
  },
];

const DashboardNav = () => {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        {navItems.map((item, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Link
                href={item.href}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                  pathname === item.href
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="sr-only">{item.label}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        ))}
      </nav>

    </TooltipProvider>
  );
};

export default DashboardNav;
