import {
    CalendarFold,
    Home,
    UserRoundPlus,
  } from "lucide-react";
  import Link from "next/link";
  
  const BottomBar = () => {
    return (
      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-background border-t md:hidden">
        <div className="container mx-auto flex justify-center items-center h-14">
          <Link
            href="/"
            className="flex items-center justify-center flex-1 text-muted-foreground hover:text-foreground"
          >
            <Home className="h-5 w-5" />
          </Link>
          <Link
            href="/eventi"
            className="flex items-center justify-center flex-1 text-muted-foreground hover:text-foreground"
          >
            <CalendarFold className="h-5 w-5" />
          </Link>
          <Link
            href="/iscrizioni"
            className="flex items-center justify-center flex-1 text-muted-foreground hover:text-foreground"
          >
            <UserRoundPlus className="h-5 w-5" />
          </Link>
        </div>
      </footer>
    );
  };
  
  export default BottomBar;