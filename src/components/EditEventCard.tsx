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
import ComboboxDemo from "./ComboBoxDashboard";


const EditEventCard = () => {
    return (
        <div className="h-1/2">
        <Card className="flex flex-col items-center justify-center h-full">
          <CardHeader>
            <CardTitle className="text-center">Modifica un evento</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center w-full space-y-4">
            <ComboboxDemo />
            <Button>
              <Link href={""}>Modifica</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

export default EditEventCard;