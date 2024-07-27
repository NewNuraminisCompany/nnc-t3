"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem 
} from "@/components/ui/command";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { db } from "@/server/db";
import { tornei } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export function ComboBoxDashboard() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string | null>(null);
  const [tournaments, setTournaments] = React.useState<{ idTorneo: string, nome: string }[]>([]);

  React.useEffect(() => {
    const fetchTournaments = async () => {
      const torneoData = await db.select().from(tornei);
      setTournaments(torneoData);
    };

    fetchTournaments();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? tournaments.find((tournament) => tournament.idTorneo === value)?.nome
            : "Select tournament..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search tournament..." className="h-9" />
          <CommandEmpty>No tournament found.</CommandEmpty>
          <CommandGroup>
            {tournaments.map((tournament) => (
              <CommandItem
                key={tournament.idTorneo}
                value={tournament.idTorneo}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                {tournament.nome}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === tournament.idTorneo ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default ComboBoxDashboard