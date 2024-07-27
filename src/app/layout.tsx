import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import NavBar from "../components/NavBar";
import SessionProvider from "../components/SessionProvider";
import { Inter } from "next/font/google";
import { type Metadata } from "next";

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
    <html lang="en" className={inter.className}>
      <body>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NavBar />
            <main className="container mx-auto pt-[10vh] w-full">{children}</main>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html >
  );
}
