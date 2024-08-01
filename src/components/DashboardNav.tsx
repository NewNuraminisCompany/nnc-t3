import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CalendarFold, Home, UserRoundPlus } from "lucide-react";
import Link from "next/link";

const DashboardNav = () => {
  return (
    <TooltipProvider>
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Home className="h-5 w-5" />
              <span className="sr-only">Home</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Eventi</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/dashboard/eventi"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <CalendarFold className="h-5 w-5" />
              <span className="sr-only">Eventi</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Eventi</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/dashboard/iscrizioni"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <UserRoundPlus className="h-5 w-5" />
              <span className="sr-only">Iscrizioni</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Iscrizioni</TooltipContent>
        </Tooltip>
      </nav>
    </TooltipProvider>
  );
};

export default DashboardNav;
