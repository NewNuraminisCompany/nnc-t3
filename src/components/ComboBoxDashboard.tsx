"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getTornei } from "./actions";

type ComboboxOption = {
  value: string;
  label: string;
};

export default function ComboBoxDashboard() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>("");
  const [torneiOptions, setTorneiOptions] = React.useState<ComboboxOption[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const data = await getTornei();
        const options = data.map((t) => ({
          value: t.idTorneo,
          label: t.nome,
        }));
        setTorneiOptions(options);
      } catch (error) {
        console.error("Failed to fetch tornei:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
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
            ? torneiOptions.find((torneo) => torneo.value === value)?.label
            : "Select torneo..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search torneo..." />
          <CommandEmpty>No torneo found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {loading ? (
                <CommandItem>Loading...</CommandItem>
              ) : (
                torneiOptions.map((torneo) => (
                  <CommandItem
                    key={torneo.value}
                    onSelect={() => {
                      setValue(torneo.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === torneo.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {torneo.label}
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}