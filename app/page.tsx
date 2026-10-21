import type { Metadata } from "next";
import Dashboard from "@/components/Dashboard";

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  return <Dashboard />;
}