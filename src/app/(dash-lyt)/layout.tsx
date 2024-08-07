import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

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
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

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
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <main className="mx-auto flex w-full flex-col md:container md:pl-14">
                <NextSSRPlugin
                  /**
                   * The `extractRouterConfig` will extract **only** the route configs
                   * from the router to prevent additional information from being
                   * leaked to the client. The data passed to the client is the same
                   * as if you were to fetch `/api/uploadthing` directly.
                   */
                  routerConfig={extractRouterConfig(ourFileRouter)}
                />
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
