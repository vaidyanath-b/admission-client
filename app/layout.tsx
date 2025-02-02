import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@nextui-org/link";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { CustomNavbar } from "@/components/navbar";
import ApplicationState from "@/context/applicantDetails/state";
import AuthState from "@/context/auth/state";
import MetaState from "@/context/metaContext/state";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <AuthState>
           <MetaState>
          <div className="relative flex flex-col h-screen">
            <CustomNavbar />
            <main className="container mx-auto pt-16 flex-grow">
              {children}
            </main>
            <footer className="w-full flex items-center justify-center py-3">
              <Link
                isExternal
                className="flex items-center gap-1 text-current"
                href="mec.ac.in"
                title="Model Engineering College"
                >
                <span className="text-default-600">Admission</span>
                <p className="text-primary">MEC</p>
              </Link>
            </footer>
          </div>
                  </MetaState>
                </AuthState>
             </Providers>
      </body>
    </html>
  );
}
