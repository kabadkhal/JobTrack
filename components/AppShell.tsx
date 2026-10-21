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
        {/* Soft blur strip: content fades out before it reaches the navbar */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[172px] backdrop-blur-md lg:left-72 lg:h-[108px]"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, black 60%, transparent)",
            maskImage:
              "linear-gradient(to bottom, black 60%, transparent)",
          }}
        />

        <Navbar />

        {/* Reserve space for the fixed navbar */}
        <div className="relative pt-[164px] lg:pt-[100px]">
          {children}
        </div>
      </div>
    </div>
  );
}