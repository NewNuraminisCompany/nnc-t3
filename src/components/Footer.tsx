import { Instagram, Mail, MailCheck } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="container mx-auto relative bottom-0 right-0 left-0 z-50 border-t bg-background">
      <div className="flex items-center justify-between gap-4 p-4 text-muted-foreground">
      <div className="flex gap-4 items-center"><p className="text-foreground text-xl font-bold">NNC</p>2024 </div>
        <div className="flex gap-4">
          <Link href="https://www.instagram.com/newnuraminiscompany/"><Instagram className="size-4" /></Link>
          <Link href="mailto:newnuraminiscompany@gmail.com"><Mail className="size-4" /></Link>
          <Link href="mailto:newnuraminiscompany@pec.it"><MailCheck className="size-4" /></Link>
        </div>
        <div className="flex gap-4 text-sm">
          <Link href="/terms">Termini e condizioni</Link>
          <Link href="/privacy">Privacy policy</Link>
      </div>
      </div>
    </footer>
  );
}
