"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen w-full">
      <Sidebar />

      <div className="relative min-h-screen min-w-0 lg:ml-72">
        <Navbar />

        <div className="relative">
          {children}
        </div>
      </div>
    </div>
  );
}