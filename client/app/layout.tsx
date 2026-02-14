import type { Metadata } from "next";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import SocketProvider from "@/providers/socket-provider";
import ApolloClientProvider from "@/providers/apollo-client-providers";
import { ReduxProvider } from "@/providers/redux-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Connecto",
};
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/providers/theme-provider";

async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <ThemeProvider>
          <ApolloClientProvider>
            <ReduxProvider>
              <SessionProvider>
                <SocketProvider>
                  <TooltipProvider delayDuration={300}>
                    {children}
                  </TooltipProvider>
                </SocketProvider>
              </SessionProvider>
            </ReduxProvider>
          </ApolloClientProvider>
        </ThemeProvider>
        <Toaster richColors position="top-right" closeButton />
      </body>
    </html>
  );
}

export default RootLayout;
