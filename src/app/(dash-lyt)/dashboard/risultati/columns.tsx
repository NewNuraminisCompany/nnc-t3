"use client";
import { deleteTorneo, updateTorneo } from "@/components/actions";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Credenza,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { TorneoData } from "@/types/db-types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns/format";
import {
  ArrowUpDown,
  CalendarIcon,
  ChevronRight,
  Edit,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";

const ActionCell = ({ torneo }: { torneo: TorneoData }) => {
  const router = useRouter();

  return (
    <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Link href={`/dashboard/risultati/${torneo.idTorneo}`}>
            <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
    </div>
  );
};

export const columns: ColumnDef<TorneoData>[] = [
  {
    accessorKey: "nome",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome Torneo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "stato",
    header: "Stato",
    cell: ({ row }) => {
      const stato = row.original.stato;
      switch (stato) {
        case "programmato":
          return "Programmato";
        case "inCorso":
          return "In corso";
        case "terminato":
          return "Terminato";
        default:
          return stato;
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell torneo={row.original} />,
  },
];