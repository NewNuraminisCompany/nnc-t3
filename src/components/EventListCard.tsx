import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import Link from "next/link";

type propsType = {
  id: string | null;
  nome: string | null;
  descrizione: string | null;
};

const EventListCard = (props: propsType) => {
  // TODO: aggiungere stato e link alla pagina del torneo
  return (
    <Card className="rounded-xl items-center justify-between overflow-scroll w-full my-2">
      <CardHeader>
        <CardTitle>{props.nome}</CardTitle>
        <CardDescription>{props.descrizione}</CardDescription>
      </CardHeader>
      <CardContent className="items-center">
        <Button><Link href={`/eventi/${props.id}`}>Scopri</Link></Button>
      </CardContent>
    </Card>
  );
};

export default EventListCard;
