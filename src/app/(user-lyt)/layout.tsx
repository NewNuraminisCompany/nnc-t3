import BottomBar from "@/components/BottomBar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import { type Metadata } from "next";
import { Inter } from "next/font/google";
import NavBar from "../../components/NavBar";
import SessionProvider from "../../components/SessionProvider";

export const metadata: Metadata = {
  title: "NNC",
  description: "Sito ufficiale NNC",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={inter.className}>
      <body>
        <SessionProvider>

          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NavBar />

            <main className="container mx-auto pt-[10vh] w-full mb-16 h-full">{children}</main>
            <Toaster />
          </ThemeProvider>
          <BottomBar />
        </SessionProvider>
      </body>
    </html >
  );
}
