"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  BriefcaseBusiness,
  CalendarDays,
  Trophy,
  XCircle,
} from "lucide-react";

import TimeGreeting from "@/components/TimeGreeting";
import ApplicationPipeline from "@/components/ApplicationPipeline";
import RecentApplications from "@/components/RecentApplications";

interface DashboardStatsData {
  totalJobs: number;
  savedJobs: number;
  appliedJobs: number;
  screeningJobs: number;
  interviewJobs: number;
  offerJobs: number;
  rejectedJobs: number;
  withdrawnJobs: number;
}

export default function Dashboard() {
  const [stats, setStats] =
    useState<DashboardStatsData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadStats() {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(
          "/api/dashboard/stats",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load dashboard statistics."
          );
        }

        const data =
          (await response.json()) as DashboardStatsData;

        if (mounted) {
          setStats(data);
        }
      } catch (error) {
        console.error(
          "Dashboard stats error:",
          error
        );

        if (mounted) {
          setError(true);
          setStats(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * Applications includes opportunities that moved
   * beyond "Saved".
   *
   * Withdrawn applications are excluded from the
   * active application count.
   */
  const applications =
    (stats?.appliedJobs ?? 0) +
    (stats?.screeningJobs ?? 0) +
    (stats?.interviewJobs ?? 0) +
    (stats?.offerJobs ?? 0) +
    (stats?.rejectedJobs ?? 0);

  const interviews =
    stats?.interviewJobs ?? 0;

  const offers =
    stats?.offerJobs ?? 0;

  const rejections =
    stats?.rejectedJobs ?? 0;

  const statsCards = [
    {
      title: "Applications",
      value: applications,
      icon: BriefcaseBusiness,
      accent: "#3b82f6",
      description:
        "Jobs you've applied to",
    },
    {
      title: "Interviews",
      value: interviews,
      icon: CalendarDays,
      accent: "#ec4899",
      description:
        "Active interview opportunities",
    },
    {
      title: "Offers",
      value: offers,
      icon: Trophy,
      accent: "#10b981",
      description:
        "Offers received",
    },
    {
      title: "Rejections",
      value: rejections,
      icon: XCircle,
      accent: "#fb7185",
      description:
        "Applications rejected",
    },
  ];

  return (
        <main
      className="
        min-h-screen
        w-full
        overflow-x-hidden

        px-4
        pb-10

        pt-[155px]

        sm:px-6
        sm:pt-[155px]

        lg:px-8
        lg:pt-[96px]
      "
      style={{
        margin: 0,
        paddingBottom: 40,
        paddingLeft: 16,
        paddingRight: 16,
        minHeight: "100vh",
        width: "100%",
        display: "block",
        position: "relative",
        top: 0,
        transform: "none",
      }}
    >
      <div
        style={{
          margin: 0,
          padding: 0,
          width: "100%",
          maxWidth: "1600px",
        }}
      >
        {/* =================================================
            HEADER
        ================================================== */}

        <section
          style={{
            margin: 0,
            padding: 0,
          }}
        >
          <p
            className="text-sm"
            style={{
              color: "var(--text-muted)",
            }}
          >
            Welcome back
          </p>

          <h1
            className="
              mt-2
              max-w-4xl
              text-3xl
              font-semibold
              leading-tight
              tracking-tight
              sm:text-4xl
            "
            style={{
              color: "var(--text-primary)",
            }}
          >
            <TimeGreeting style="neutral" />
          </h1>

          <p
            className="
              mt-3
              text-sm
              sm:text-base
            "
            style={{
              color: "var(--text-secondary)",
            }}
          >
            Here's your job search overview.
          </p>
        </section>

        {/* =================================================
            ERROR
        ================================================== */}

        {error && (
          <motion.div
            initial={{
              opacity: 0,
              y: -8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="
              mt-5
              rounded-2xl
              border
              px-4
              py-3
              text-sm
            "
            style={{
              borderColor:
                "rgba(251, 113, 133, 0.25)",
              background:
                "rgba(251, 113, 133, 0.08)",
              color: "var(--danger)",
            }}
          >
            Unable to load your dashboard
            statistics. Please refresh the page
            and try again.
          </motion.div>
        )}

        {/* =================================================
            STATISTICS
        ================================================== */}

        <section
          className="
            mt-7
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.title}
                initial={{
                  opacity: 0,
                  y: 14,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -4,
                }}
                className="
                  glass
                  rounded-3xl
                  p-5
                  sm:p-6
                "
              >
                {/* Top */}

                <div className="flex items-center justify-between">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                    "
                    style={{
                      background:
                        `${stat.accent}18`,
                      color: stat.accent,
                    }}
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.8}
                    />
                  </div>

                  <div
                    className="
                      h-1.5
                      w-1.5
                      rounded-full
                    "
                    style={{
                      background:
                        stat.accent,
                      boxShadow:
                        `0 0 10px ${stat.accent}`,
                    }}
                  />
                </div>

                {/* Title */}

                <p
                  className="mt-5 text-sm"
                  style={{
                    color:
                      "var(--text-secondary)",
                  }}
                >
                  {stat.title}
                </p>

                {/* Value */}

                <div className="mt-2 flex items-center">
                  {loading ? (
                    <div
                      className="
                        h-9
                        w-16
                        animate-pulse
                        rounded-lg
                      "
                      style={{
                        background:
                          "var(--glass-hover)",
                      }}
                    />
                  ) : (
                    <motion.span
                      key={stat.value}
                      initial={{
                        opacity: 0,
                        y: 5,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="
                        text-3xl
                        font-semibold
                      "
                      style={{
                        color:
                          "var(--text-primary)",
                      }}
                    >
                      {stat.value}
                    </motion.span>
                  )}
                </div>

                {/* Description */}

                <p
                  className="mt-2 text-xs"
                  style={{
                    color:
                      "var(--text-muted)",
                  }}
                >
                  {loading
                    ? "Loading..."
                    : stat.value === 0
                      ? "No activity yet"
                      : stat.description}
                </p>
              </motion.div>
            );
          })}
        </section>

        {/* =================================================
            APPLICATION PIPELINE
        ================================================== */}

        <section className="mt-8">
          <ApplicationPipeline />
        </section>

        {/* =================================================
            RECENT APPLICATIONS
        ================================================== */}

        <section className="mt-8 pb-8">
          <RecentApplications />
        </section>
      </div>
    </main>
  );
}