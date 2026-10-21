import type { Metadata } from "next";

import "./globals.css";

import ThemeProvider from "@/components/ThemeProvider";
import AuthProvider from "@/components/AuthProvider";
import { JobProvider } from "@/context/JobContext";
import AppShell from "@/components/AppShell";
import { ToastProvider } from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: {
    default: "JobTrack",
    template: "%s | JobTrack",
  },
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("jobtrack-theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.classList.add(t)}catch(e){document.documentElement.classList.add("dark")}`,
          }}
        />
      </head>
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