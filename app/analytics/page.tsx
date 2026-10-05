"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  Percent,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";

/* ---------------- Types ---------------- */

type PipelineItem = {
  status: string;
  label: string;
  count: number;
};

type ApplicationTrend = {
  month: string;
  count: number;
};

type CompanyItem = {
  company: string;
  count: number;
};

type JobTypeItem = {
  type: string;
  count: number;
};

type LocationItem = {
  location: string;
  count: number;
};

type AnalyticsData = {
  overview: {
    totalApplications: number;
    activeApplications: number;
    saved: number;
    applied: number;
    screening: number;
    interviews: number;
    offers: number;
    rejected: number;
    withdrawn: number;
  };

  metrics: {
    interviewRate: number;
    offerRate: number;
    rejectionRate: number;
    responseRate: number;
  };

  pipeline: PipelineItem[];

  applicationTrend: ApplicationTrend[];

  topCompanies: CompanyItem[];

  jobTypes: JobTypeItem[];

  topLocations: LocationItem[];
};

/* ---------------- Status Config ---------------- */

const statusConfig: Record<
  string,
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

/* ---------------- Helpers ---------------- */

function formatMonth(month: string) {
  const [year, monthNumber] = month.split("-");

  const date = new Date(
    Number(year),
    Number(monthNumber) - 1,
    1
  );

  return date.toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });
}

function formatJobType(type: string) {
  return type
    .split("-")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1)
    )
    .join(" ");
}

/* ---------------- Page ---------------- */

export default function AnalyticsPage() {
  const router = useRouter();

  const [data, setData] =
    useState<AnalyticsData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAnalytics() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/analytics/stats",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          const result =
            await response.json().catch(
              () => null
            );

          throw new Error(
            result?.message ||
              "Failed to load analytics."
          );
        }

        const result =
          (await response.json()) as AnalyticsData;

        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        console.error(
          "Analytics loading error:",
          err
        );

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load analytics."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------------- Loading ---------------- */

  if (loading) {
    return (
      <main
        className="min-h-screen px-4 pb-12 sm:px-6 lg:px-8"
        style={{ paddingTop: "108px" }}
      >
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="animate-pulse">
            <div
              className="h-4 w-40 rounded"
              style={{
                background: "var(--glass)",
              }}
            />

            <div
              className="mt-4 h-10 w-64 rounded-xl"
              style={{
                background: "var(--glass)",
              }}
            />

            <div
              className="mt-3 h-4 w-96 max-w-full rounded"
              style={{
                background: "var(--glass)",
              }}
            />

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="glass h-36 rounded-3xl"
                  />
                )
              )}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="glass h-32 rounded-3xl"
                  />
                )
              )}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.9fr]">
              <div className="glass h-[420px] rounded-3xl" />
              <div className="glass h-[420px] rounded-3xl" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ---------------- Error ---------------- */

  if (error || !data) {
    return (
      <main
        className="min-h-screen px-4 pb-12 sm:px-6 lg:px-8"
        style={{ paddingTop: "108px" }}
      >
        <div className="mx-auto w-full max-w-[1600px]">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all duration-200 hover:-translate-x-1"
            style={{
              color: "var(--text-secondary)",
              background: "var(--glass)",
              border:
                "1px solid var(--glass-border)",
            }}
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="glass rounded-3xl p-10 text-center">
            <div
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{
                background:
                  "rgba(251, 113, 133, 0.12)",
                color: "#fb7185",
              }}
            >
              <XCircle size={24} />
            </div>

            <h1
              className="mt-5 text-xl font-semibold"
              style={{
                color: "var(--text-primary)",
              }}
            >
              Unable to load analytics
            </h1>

            <p
              className="mt-2 text-sm"
              style={{
                color: "var(--text-muted)",
              }}
            >
              {error ||
                "Something went wrong while loading your analytics."}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-6 rounded-xl px-5 py-3 text-sm font-medium transition hover:-translate-y-0.5"
              style={{
                background: "var(--accent)",
                color: "#ffffff",
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </main>
    );
  }

  const {
    overview,
    metrics,
    pipeline,
    applicationTrend,
    topCompanies,
    jobTypes,
    topLocations,
  } = data;

  const maxPipelineCount = Math.max(
    ...pipeline.map((item) => item.count),
    1
  );

  const maxMonthlyApplications = Math.max(
    ...applicationTrend.map(
      (month) => month.count
    ),
    1
  );

  const totalJobs =
    overview.totalApplications +
    overview.saved +
    overview.withdrawn;

  return (
    <main
      className="min-h-screen px-4 pb-12 sm:px-6 lg:px-8"
      style={{ paddingTop: "108px" }}
    >
      <div className="mx-auto w-full max-w-[1600px]">
        {/* Header */}

        <section>
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all duration-200 hover:-translate-x-1"
            style={{
              color: "var(--text-secondary)",
              background: "var(--glass)",
              border:
                "1px solid var(--glass-border)",
            }}
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p
                className="text-sm"
                style={{
                  color: "var(--text-muted)",
                }}
              >
                Your job search performance
              </p>

              <h1
                className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl"
                style={{
                  color: "var(--text-primary)",
                }}
              >
                Analytics
              </h1>

              <p
                className="mt-3 max-w-2xl text-sm sm:text-base"
                style={{
                  color: "var(--text-secondary)",
                }}
              >
                Understand your application
                pipeline and see how your job
                search is progressing.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push("/jobs")
              }
              className="flex w-fit items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition hover:-translate-y-0.5"
              style={{
                background: "var(--accent)",
                color: "#ffffff",
              }}
            >
              View applications
              <ArrowUpRight size={16} />
            </button>
          </div>
        </section>

        {/* Main Stats */}

        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total jobs"
            value={totalJobs}
            description="All tracked opportunities"
            icon={BriefcaseBusiness}
          />

          <MetricCard
            label="Applications"
            value={overview.totalApplications}
            description="Submitted applications"
            icon={Target}
          />

          <MetricCard
            label="Interviews"
            value={overview.interviews}
            description="Interview-stage applications"
            icon={CalendarDays}
          />

          <MetricCard
            label="Offers"
            value={overview.offers}
            description="Offers received"
            icon={Trophy}
          />
        </section>

        {/* Conversion Metrics */}

        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <PercentageCard
            label="Response rate"
            value={metrics.responseRate}
            description="Applications reaching a response stage"
            icon={Clock3}
          />

          <PercentageCard
            label="Interview rate"
            value={metrics.interviewRate}
            description="Applications reaching interviews"
            icon={CalendarDays}
          />

          <PercentageCard
            label="Offer rate"
            value={metrics.offerRate}
            description="Applications resulting in offers"
            icon={Trophy}
          />

          <PercentageCard
            label="Rejection rate"
            value={metrics.rejectionRate}
            description="Applications marked rejected"
            icon={XCircle}
          />
        </section>

        {/* Pipeline + Status */}

        <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          {/* Application Pipeline */}

          <div className="glass rounded-3xl p-6 sm:p-7">
            <div className="flex items-start justify-between">
              <div>
                <p
                  className="text-sm"
                  style={{
                    color: "var(--text-muted)",
                  }}
                >
                  Funnel
                </p>

                <h2
                  className="mt-1 text-xl font-semibold"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  Application Pipeline
                </h2>
              </div>

              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  background:
                    "var(--accent-soft)",
                  color: "var(--accent)",
                }}
              >
                <BarChart3 size={18} />
              </div>
            </div>

            <div className="mt-7 space-y-5">
              {pipeline
                .filter(
                  (item) =>
                    item.status !==
                    "rejected" &&
                    item.status !==
                    "withdrawn"
                )
                .map((item) => {
                  const config =
                    statusConfig[item.status];

                  const width =
                    (item.count /
                      maxPipelineCount) *
                    100;

                  return (
                    <div key={item.status}>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{
                              background:
                                config?.color ||
                                "var(--accent)",
                            }}
                          />

                          <span
                            className="text-sm"
                            style={{
                              color:
                                "var(--text-secondary)",
                            }}
                          >
                            {item.label}
                          </span>
                        </div>

                        <span
                          className="text-sm font-semibold"
                          style={{
                            color:
                              "var(--text-primary)",
                          }}
                        >
                          {item.count}
                        </span>
                      </div>

                      <div
                        className="h-2 overflow-hidden rounded-full"
                        style={{
                          background:
                            "var(--glass)",
                        }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${width}%`,
                            background:
                              config?.color ||
                              "var(--accent)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Status Distribution */}

          <div className="glass rounded-3xl p-6 sm:p-7">
            <div>
              <p
                className="text-sm"
                style={{
                  color: "var(--text-muted)",
                }}
              >
                Breakdown
              </p>

              <h2
                className="mt-1 text-xl font-semibold"
                style={{
                  color: "var(--text-primary)",
                }}
              >
                Status Distribution
              </h2>
            </div>

            <div className="mt-7 space-y-3">
              {pipeline.map((item) => {
                const config =
                  statusConfig[item.status];

                const percentage =
                  totalJobs > 0
                    ? (item.count /
                        totalJobs) *
                      100
                    : 0;

                return (
                  <div
                    key={item.status}
                    className="flex items-center gap-3 rounded-2xl p-3"
                    style={{
                      background:
                        "var(--glass)",
                    }}
                  >
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        background:
                          config?.background ||
                          "var(--accent-soft)",
                        color:
                          config?.color ||
                          "var(--accent)",
                      }}
                    >
                      <span className="h-2 w-2 rounded-full bg-current" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className="text-sm font-medium"
                          style={{
                            color:
                              "var(--text-primary)",
                          }}
                        >
                          {item.label}
                        </span>

                        <span
                          className="text-xs"
                          style={{
                            color:
                              "var(--text-muted)",
                          }}
                        >
                          {percentage.toFixed(0)}%
                        </span>
                      </div>

                      <div className="mt-1.5 flex items-center justify-between">
                        <div
                          className="h-1.5 flex-1 overflow-hidden rounded-full"
                          style={{
                            background:
                              "var(--glass)",
                          }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${percentage}%`,
                              background:
                                config?.color ||
                                "var(--accent)",
                            }}
                          />
                        </div>

                        <span
                          className="ml-3 text-xs font-medium"
                          style={{
                            color:
                              "var(--text-secondary)",
                          }}
                        >
                          {item.count}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Monthly Activity */}

        <section className="mt-6">
          <div className="glass rounded-3xl p-6 sm:p-7">
            <div className="flex items-start justify-between">
              <div>
                <p
                  className="text-sm"
                  style={{
                    color: "var(--text-muted)",
                  }}
                >
                  Activity
                </p>

                <h2
                  className="mt-1 text-xl font-semibold"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  Applications Over Time
                </h2>

                <p
                  className="mt-2 text-sm"
                  style={{
                    color:
                      "var(--text-secondary)",
                  }}
                >
                  Your application activity by
                  month.
                </p>
              </div>

              <div
                className="hidden h-10 w-10 items-center justify-center rounded-xl sm:flex"
                style={{
                  background:
                    "var(--accent-soft)",
                  color: "var(--accent)",
                }}
              >
                <CalendarDays size={18} />
              </div>
            </div>

            {applicationTrend.length === 0 ? (
              <EmptyAnalytics text="Application activity will appear here once you start applying." />
            ) : (
              <div className="mt-8 flex min-h-[280px] items-end gap-3 sm:gap-5">
                {applicationTrend.map(
                  (month) => {
                    const height =
                      (month.count /
                        maxMonthlyApplications) *
                      100;

                    return (
                      <div
                        key={month.month}
                        className="flex min-h-[240px] flex-1 flex-col justify-end"
                      >
                        <div className="mb-2 text-center">
                          <span
                            className="text-xs font-semibold"
                            style={{
                              color:
                                "var(--text-primary)",
                            }}
                          >
                            {month.count}
                          </span>
                        </div>

                        <div
                          className="relative w-full overflow-hidden rounded-t-2xl"
                          style={{
                            height: `${Math.max(
                              height,
                              4
                            )}%`,
                            background:
                              "linear-gradient(180deg, var(--accent), rgba(139,92,246,0.35))",
                            boxShadow:
                              "0 0 30px rgba(139,92,246,0.10)",
                          }}
                        />

                        <p
                          className="mt-3 text-center text-xs"
                          style={{
                            color:
                              "var(--text-muted)",
                          }}
                        >
                          {formatMonth(
                            month.month
                          )}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
        </section>

        {/* Company + Job Type */}

        <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Top Companies */}

          <div className="glass rounded-3xl p-6 sm:p-7">
            <div>
              <p
                className="text-sm"
                style={{
                  color: "var(--text-muted)",
                }}
              >
                Company activity
              </p>

              <h2
                className="mt-1 text-xl font-semibold"
                style={{
                  color: "var(--text-primary)",
                }}
              >
                Most Applied Companies
              </h2>
            </div>

            {topCompanies.length === 0 ? (
              <EmptyAnalytics text="Your companies will appear here once you start applying." />
            ) : (
              <div className="mt-6 space-y-3">
                {topCompanies.map(
                  (company, index) => (
                    <div
                      key={company.company}
                      className="flex items-center gap-4 rounded-2xl p-3"
                      style={{
                        background:
                          "var(--glass)",
                      }}
                    >
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-semibold"
                        style={{
                          background:
                            "var(--accent-soft)",
                          color:
                            "var(--accent)",
                        }}
                      >
                        {index + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className="truncate text-sm font-medium"
                          style={{
                            color:
                              "var(--text-primary)",
                          }}
                        >
                          {company.company}
                        </p>

                        <p
                          className="mt-0.5 text-xs"
                          style={{
                            color:
                              "var(--text-muted)",
                          }}
                        >
                          {company.count}{" "}
                          {company.count === 1
                            ? "application"
                            : "applications"}
                        </p>
                      </div>

                      <ArrowUpRight
                        size={15}
                        style={{
                          color:
                            "var(--text-muted)",
                        }}
                      />
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Job Types */}

          <div className="glass rounded-3xl p-6 sm:p-7">
            <div>
              <p
                className="text-sm"
                style={{
                  color: "var(--text-muted)",
                }}
              >
                Opportunity mix
              </p>

              <h2
                className="mt-1 text-xl font-semibold"
                style={{
                  color: "var(--text-primary)",
                }}
              >
                Job Types
              </h2>
            </div>

            {jobTypes.length === 0 ? (
              <EmptyAnalytics text="Job type statistics will appear here once you add jobs." />
            ) : (
              <div className="mt-6 space-y-4">
                {jobTypes.map((item) => {
                  const percentage =
                    overview.totalApplications >
                    0
                      ? (item.count /
                          overview.totalApplications) *
                        100
                      : 0;

                  return (
                    <div key={item.type}>
                      <div className="mb-2 flex items-center justify-between">
                        <span
                          className="text-sm font-medium"
                          style={{
                            color:
                              "var(--text-primary)",
                          }}
                        >
                          {formatJobType(
                            item.type
                          )}
                        </span>

                        <span
                          className="text-xs"
                          style={{
                            color:
                              "var(--text-muted)",
                          }}
                        >
                          {item.count}
                        </span>
                      </div>

                      <div
                        className="h-2 overflow-hidden rounded-full"
                        style={{
                          background:
                            "var(--glass)",
                        }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${percentage}%`,
                            background:
                              "var(--accent)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Locations */}

        <section className="mt-6">
          <div className="glass rounded-3xl p-6 sm:p-7">
            <div>
              <p
                className="text-sm"
                style={{
                  color: "var(--text-muted)",
                }}
              >
                Geographic activity
              </p>

              <h2
                className="mt-1 text-xl font-semibold"
                style={{
                  color: "var(--text-primary)",
                }}
              >
                Application Locations
              </h2>
            </div>

            {topLocations.length === 0 ? (
              <EmptyAnalytics text="Location statistics will appear here once you add applications." />
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {topLocations.map(
                  (location) => (
                    <div
                      key={location.location}
                      className="rounded-2xl p-4"
                      style={{
                        background:
                          "var(--glass)",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="truncate text-sm font-medium"
                          style={{
                            color:
                              "var(--text-primary)",
                          }}
                        >
                          {location.location}
                        </span>

                        <span
                          className="ml-3 flex h-7 min-w-7 items-center justify-center rounded-lg px-2 text-xs font-semibold"
                          style={{
                            background:
                              "var(--accent-soft)",
                            color:
                              "var(--accent)",
                          }}
                        >
                          {location.count}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </section>

        {/* Progress */}

        <section className="mt-6">
          <div className="glass rounded-3xl p-6 sm:p-7">
            <div>
              <p
                className="text-sm"
                style={{
                  color: "var(--text-muted)",
                }}
              >
                Search health
              </p>

              <h2
                className="mt-1 text-xl font-semibold"
                style={{
                  color: "var(--text-primary)",
                }}
              >
                Your Progress
              </h2>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ProgressTile
                label="Screening"
                value={overview.screening}
                icon={Clock3}
              />

              <ProgressTile
                label="Interviews"
                value={overview.interviews}
                icon={CalendarDays}
              />

              <ProgressTile
                label="Offers"
                value={overview.offers}
                icon={Trophy}
              />

              <ProgressTile
                label="Rejected"
                value={overview.rejected}
                icon={XCircle}
              />
            </div>

            <div
              className="mt-5 rounded-2xl p-4"
              style={{
                background:
                  "var(--accent-soft)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{
                    background:
                      "var(--accent)",
                    color: "#ffffff",
                  }}
                >
                  <Percent size={17} />
                </div>

                <div>
                  <p
                    className="text-sm font-medium"
                    style={{
                      color:
                        "var(--text-primary)",
                    }}
                  >
                    Overall response rate
                  </p>

                  <p
                    className="mt-0.5 text-xs"
                    style={{
                      color:
                        "var(--text-secondary)",
                    }}
                  >
                    {metrics.responseRate.toFixed(
                      1
                    )}
                    % of your applications have
                    progressed beyond the initial
                    application stage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* No Data */}

        {overview.totalApplications === 0 &&
          overview.saved === 0 &&
          overview.withdrawn === 0 && (
            <section className="mt-6">
              <div className="glass rounded-3xl p-10 text-center">
                <div
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{
                    background:
                      "var(--accent-soft)",
                    color: "var(--accent)",
                  }}
                >
                  <BarChart3 size={23} />
                </div>

                <h2
                  className="mt-5 text-xl font-semibold"
                  style={{
                    color:
                      "var(--text-primary)",
                  }}
                >
                  Your analytics will appear
                  here
                </h2>

                <p
                  className="mx-auto mt-2 max-w-md text-sm"
                  style={{
                    color:
                      "var(--text-muted)",
                  }}
                >
                  Start adding jobs and
                  applications to see your job
                  search performance here.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    router.push("/jobs")
                  }
                  className="mt-6 rounded-xl px-5 py-3 text-sm font-medium transition hover:-translate-y-0.5"
                  style={{
                    background:
                      "var(--accent)",
                    color: "#ffffff",
                  }}
                >
                  Add your first job
                </button>
              </div>
            </section>
          )}
      </div>
    </main>
  );
}

/* ---------------- Metric Card ---------------- */

function MetricCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: number;
  description: string;
  icon: typeof BriefcaseBusiness;
}) {
  return (
    <div className="glass rounded-3xl p-5 sm:p-6">
      <div className="flex items-start justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{
            background:
              "var(--accent-soft)",
            color: "var(--accent)",
          }}
        >
          <Icon
            size={18}
            strokeWidth={1.8}
          />
        </div>
      </div>

      <p
        className="mt-5 text-sm"
        style={{
          color: "var(--text-secondary)",
        }}
      >
        {label}
      </p>

      <p
        className="mt-1 text-3xl font-semibold"
        style={{
          color: "var(--text-primary)",
        }}
      >
        {value}
      </p>

      <p
        className="mt-2 text-xs"
        style={{
          color: "var(--text-muted)",
        }}
      >
        {description}
      </p>
    </div>
  );
}

/* ---------------- Percentage Card ---------------- */

function PercentageCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: number;
  description: string;
  icon: typeof Clock3;
}) {
  return (
    <div className="glass rounded-3xl p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{
            background:
              "var(--accent-soft)",
            color: "var(--accent)",
          }}
        >
          <Icon size={18} />
        </div>

        <span
          className="text-2xl font-semibold"
          style={{
            color: "var(--text-primary)",
          }}
        >
          {value.toFixed(1)}%
        </span>
      </div>

      <p
        className="mt-5 text-sm font-medium"
        style={{
          color: "var(--text-primary)",
        }}
      >
        {label}
      </p>

      <p
        className="mt-1 text-xs leading-5"
        style={{
          color: "var(--text-muted)",
        }}
      >
        {description}
      </p>
    </div>
  );
}

/* ---------------- Progress Tile ---------------- */

function ProgressTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Clock3;
}) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "var(--glass)",
      }}
    >
      <div className="flex items-center justify-between">
        <Icon
          size={16}
          style={{
            color: "var(--accent)",
          }}
        />

        <span
          className="text-lg font-semibold"
          style={{
            color:
              "var(--text-primary)",
          }}
        >
          {value}
        </span>
      </div>

      <p
        className="mt-3 text-xs"
        style={{
          color:
            "var(--text-secondary)",
        }}
      >
        {label}
      </p>
    </div>
  );
}

/* ---------------- Empty Analytics ---------------- */

function EmptyAnalytics({
  text,
}: {
  text: string;
}) {
  return (
    <div
      className="mt-6 rounded-2xl p-6 text-center"
      style={{
        background: "var(--glass)",
      }}
    >
      <p
        className="text-sm"
        style={{
          color: "var(--text-muted)",
        }}
      >
        {text}
      </p>
    </div>
  );
}