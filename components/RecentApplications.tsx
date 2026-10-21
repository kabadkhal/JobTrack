"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Briefcase,
  CalendarDays,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { useJobs } from "@/context/JobContext";
import type { JobStatus } from "@/types/job";

const statusConfig: Record<
  JobStatus,
  {
    label: string;
    color: string;
    background: string;
  }
> = {
  saved: {
    label: "Saved",
    color: "#8b5cf6",
    background: "rgba(139, 92, 246, 0.12)",
  },
  applied: {
    label: "Applied",
    color: "#3b82f6",
    background: "rgba(59, 130, 246, 0.12)",
  },
  screening: {
    label: "Screening",
    color: "#f59e0b",
    background: "rgba(245, 158, 11, 0.12)",
  },
  interview: {
    label: "Interview",
    color: "#ec4899",
    background: "rgba(236, 72, 153, 0.12)",
  },
  offer: {
    label: "Offer",
    color: "#10b981",
    background: "rgba(16, 185, 129, 0.12)",
  },
  rejected: {
    label: "Rejected",
    color: "#fb7185",
    background: "rgba(251, 113, 133, 0.12)",
  },
  withdrawn: {
    label: "Withdrawn",
    color: "#64748b",
    background: "rgba(100, 116, 139, 0.12)",
  },
};

function getInitials(company: string) {
  return company
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function RecentApplications() {
  const { jobs } = useJobs();
  const router = useRouter();

  /*
   * Only jobs that have moved beyond
   * the Saved stage are applications.
   */
  const applications = jobs.filter(
    (job) => job.status !== "saved"
  );

  /*
   * Show the five most recent applications.
   */
  const recentApplications = applications.slice(0, 5);

  return (
    <section className="mt-8">
      {/* Heading */}
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p
            className="text-sm"
            style={{
              color: "var(--text-muted)",
            }}
          >
            Your job search
          </p>

          <h3
            className="mt-1 text-xl font-semibold"
            style={{
              color: "var(--text-primary)",
            }}
          >
            Recent Applications
          </h3>
        </div>

        <button
          type="button"
          onClick={() => router.push("/jobs")}
          className="flex items-center gap-1 text-sm transition hover:opacity-70"
          style={{
            color: "var(--accent)",
          }}
        >
          View all
          <ArrowUpRight size={15} />
        </button>
      </div>

      {/* Empty State */}
      {recentApplications.length === 0 && (
        <div
          className="glass rounded-3xl p-8 text-center"
          style={{
            color: "var(--text-secondary)",
          }}
        >
          <Briefcase
            size={24}
            className="mx-auto opacity-50"
          />

          <p className="mt-3 text-sm">
            No applications yet.
          </p>

          <button
            type="button"
            onClick={() => router.push("/jobs")}
            className="mt-4 rounded-xl px-4 py-2 text-sm font-medium transition hover:opacity-80"
            style={{
              background: "var(--accent-soft)",
              color: "var(--accent)",
            }}
          >
            Add your first job
          </button>
        </div>
      )}

      {/* Application list */}
      {recentApplications.length > 0 && (
        <div className="glass overflow-hidden rounded-3xl">
          {recentApplications.map((job, index) => {
            const status = statusConfig[job.status];

            return (
              <motion.div
                key={job.id}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.06,
                }}
                className="flex items-center gap-4 border-b px-5 py-4 transition-colors last:border-b-0 hover:bg-[color:var(--surface-hover)]"
                style={{
                  borderColor: "var(--glass-border)",
                }}
              >
                {/* Company logo */}
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-semibold"
                  style={{
                    background: "var(--accent-soft)",
                    color: "var(--accent)",
                  }}
                >
                  {getInitials(job.company)}
                </div>

                {/* Job information */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4
                      className="truncate text-sm font-medium"
                      style={{
                        color: "var(--text-primary)",
                      }}
                    >
                      {job.position}
                    </h4>
                  </div>

                  <div
                    className="mt-1 flex flex-wrap items-center gap-3 text-xs"
                    style={{
                      color: "var(--text-muted)",
                    }}
                  >
                    <span className="flex items-center gap-1">
                      <Briefcase size={12} />
                      {job.company}
                    </span>

                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {job.location}
                    </span>

                    <span className="flex items-center gap-1">
                      <CalendarDays size={12} />
                      {job.appliedDate}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div
                  className="hidden rounded-full px-3 py-1.5 text-xs font-medium sm:block"
                  style={{
                    color: status.color,
                    background: status.background,
                  }}
                >
                  {status.label}
                </div>

                {/* Arrow */}
                <button
                  type="button"
                  onClick={() => router.push("/jobs")}
                  className="rounded-lg p-2 transition hover:scale-105"
                  style={{
                    color: "var(--text-muted)",
                  }}
                  aria-label={`Open ${job.position}`}
                >
                  <ArrowUpRight size={17} />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}