import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import NavBar from "../components/NavBar";
import SessionProvider from "../components/SessionProvider";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "NNC",
  description: "Sito ufficiale NNC",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
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
