import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

type propsType = {
  id: string;
  nome: string | null;
  descrizione: string | null;
  stato: string | null;
};

const EventListCard = (props: propsType) => {
  return (
    <div className="items-center justify-between rounded-xl pb-2">
      <Link href={`/eventi/${props.id}`}>
        <Card className="shadow-lg">
          <CardHeader className="flex items-center justify-between gap-y-2">
            <Badge className="mx-auto" variant="outline">
              {props.stato}
            </Badge>
            <CardTitle>{props.nome}</CardTitle>
            <CardDescription>{props.descrizione}</CardDescription>
          </CardHeader>
        </Card>
      </Link>
    </div>
  );
};

export default EventListCard;
