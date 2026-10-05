import type { Metadata } from "next";

import "./globals.css";

import ThemeProvider from "@/components/ThemeProvider";
import AuthProvider from "@/components/AuthProvider";
import { JobProvider } from "@/context/JobContext";
import AppShell from "@/components/AppShell";
import { ToastProvider } from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "JobTrack",
  description: "Your career command center",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          <AuthProvider>
            <JobProvider>
             <ToastProvider>
              <AppShell>
                {children}
              </AppShell>
             </ToastProvider>
            </JobProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}