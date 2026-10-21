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
            className="animate-pulse rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 backdrop-blur-xl"
          >
            <div className="h-4 w-24 rounded bg-[color:var(--border)]" />

            <div className="mt-5 h-10 w-16 rounded bg-[color:var(--border)]" />

            <div className="mt-3 h-3 w-40 rounded bg-[color:var(--border)]" />
          </div>
        ))}
      </section>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-[color:var(--danger-border)] bg-[color:var(--danger-soft)] p-6">
        <p className="text-sm text-[color:var(--danger)]">{error}</p>
      </div>
    );
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="group rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[color:var(--accent)] hover:bg-[color:var(--surface-hover)]"
        >
          <p className="text-sm font-medium text-[color:var(--text-secondary)]">
            {card.title}
          </p>

          <p className="mt-4 text-4xl font-semibold tracking-tight">
            {card.value ?? 0}
          </p>

          <p className="mt-2 text-xs text-[color:var(--text-muted)]">
            {card.description}
          </p>
        </div>
      ))}
    </section>
  );
}