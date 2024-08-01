import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    CalendarFold,
    Home,
    PanelLeft,
    UserRoundPlus
} from "lucide-react";
import Link from "next/link";

const TopBar = () => {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 pt-10 text-lg font-medium">
            <Link
              href="/dashboard"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Home className="h-5 w-5" />
              Home
            </Link>
            <Link
              href="/dashboard/eventi"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <CalendarFold className="h-5 w-5" />
              Eventi
            </Link>
            <Link
              href="/dashboard/iscrizioni"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <UserRoundPlus className="h-5 w-5" />
              Iscrizioni
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default TopBar;
