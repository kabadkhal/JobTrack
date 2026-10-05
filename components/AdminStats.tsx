"use client";

import { useEffect, useState } from "react";

interface AdminStatsData {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  totalInterviews: number;
}

export default function AdminStats() {
  const [stats, setStats] = useState<AdminStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/admin/stats", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Failed to load statistics.");
        }

        setStats(data);
      } catch (error) {
        console.error("Failed to load admin statistics:", error);
        setError("Failed to load administrator statistics.");
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: stats?.totalUsers,
      description: "Registered JobTrack users",
    },
    {
      title: "Total Jobs",
      value: stats?.totalJobs,
      description: "Jobs stored in the platform",
    },
    {
      title: "Applications",
      value: stats?.totalApplications,
      description: "Tracked job applications",
    },
    {
      title: "Interviews",
      value: stats?.totalInterviews,
      description: "Jobs currently in interview stage",
    },
  ];

  if (loading) {
    return (
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="animate-pulse rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
          >
            <div className="h-4 w-24 rounded bg-white/10" />

            <div className="mt-5 h-10 w-16 rounded bg-white/10" />

            <div className="mt-3 h-3 w-40 rounded bg-white/10" />
          </div>
        ))}
      </section>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-400/20 bg-red-400/5 p-6">
        <p className="text-sm text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.06]"
        >
          <p className="text-sm font-medium text-slate-400">
            {card.title}
          </p>

          <p className="mt-4 text-4xl font-semibold tracking-tight">
            {card.value ?? 0}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {card.description}
          </p>
        </div>
      ))}
    </section>
  );
}