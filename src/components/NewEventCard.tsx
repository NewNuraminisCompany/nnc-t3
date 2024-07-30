import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from "./ui/button";
import Link from "next/link";


const NewEventCard = () => {
    return(
        <div className="h-1/2">
        <Card className="flex flex-col items-center justify-center h-full">
          <CardHeader>
            <CardTitle className="text-center">Crea un nuovo evento</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <Button>
              <Link href={""}>Crea</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

export default NewEventCard;