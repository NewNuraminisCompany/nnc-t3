import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";

import SessionProvider from "../../components/SessionProvider";
import { Inter } from "next/font/google";
import { type Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import DashboardNav from "@/components/DashboardNav";
import TopBar from "@/components/TopBar";

export const metadata: Metadata = {
  title: "NNC Dashboard",
  description: "Sito ufficiale NNC",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-background">
        <SessionProvider>
          <div vaul-drawer-wrapper="" className="bg-background">
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
              <DashboardNav />
            </aside>
            <TopBar />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
            >
              <main className="container mx-auto w-full md:pl-14">
                {children}
              </main>
              <Toaster />
            </ThemeProvider>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
