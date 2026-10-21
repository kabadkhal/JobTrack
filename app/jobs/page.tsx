"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useJobs } from "@/context/JobContext";
import { useToast } from "@/components/ToastProvider";

import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Filter,
  MapPin,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  Trophy,
  X,
} from "lucide-react";

import AddJobModal from "@/components/AddJobModal";
import JobDetailsModal from "@/components/JobDetailsModal";


import type { Job, JobStatus, JobType } from "@/types/job";

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

const jobTypes: {
  value: JobType | "all";
  label: string;
}[] = [
  {
    value: "all",
    label: "All types",
  },
  {
    value: "full-time",
    label: "Full-time",
  },
  {
    value: "part-time",
    label: "Part-time",
  },
  {
    value: "internship",
    label: "Internship",
  },
  {
    value: "contract",
    label: "Contract",
  },
];

const statuses: {
  value: JobStatus | "all";
  label: string;
}[] = [
  {
    value: "all",
    label: "All statuses",
  },
  {
    value: "saved",
    label: "Saved",
  },
  {
    value: "applied",
    label: "Applied",
  },
  {
    value: "screening",
    label: "Screening",
  },
  {
    value: "interview",
    label: "Interview",
  },
  {
    value: "offer",
    label: "Offer",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
  {
    value: "withdrawn",
    label: "Withdrawn",
  },
];

type SortOption = "newest" | "oldest" | "company";

export default function JobsPage() {
  const router = useRouter();

  const {
    jobs,
    isLoading,
    error,
    deleteJob,
  } = useJobs();

  const { showToast } = useToast();

  const [showAddJob, setShowAddJob] = useState(false);

  const [selectedJob, setSelectedJob] =
    useState<Job | null>(null);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<JobStatus | "all">("all");

  const [typeFilter, setTypeFilter] =
    useState<JobType | "all">("all");

  const [sortBy, setSortBy] =
    useState<SortOption>("newest");

  const [showFilters, setShowFilters] =
    useState(false);

  /*
   * Open a specific job when the URL contains:
   *
   * /jobs?job=JOB_ID
   *
   * This is used by the global navbar search.
   */
  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const jobId = params.get("job");

    if (!jobId) {
      return;
    }

    const job = jobs.find(
      (item) => item.id === jobId
    );

    if (job) {
      setSelectedJob(job);
    }
  }, [jobs]);

  /*
   * Dashboard statistics
   */
  const stats = useMemo(() => {
    const applications = jobs.filter(
      (job) =>
        job.status !== "saved" &&
        job.status !== "withdrawn"
    ).length;

    const interviews = jobs.filter(
      (job) => job.status === "interview"
    ).length;

    const offers = jobs.filter(
      (job) => job.status === "offer"
    ).length;

    const rejections = jobs.filter(
      (job) => job.status === "rejected"
    ).length;

    return {
      total: jobs.length,
      applications,
      interviews,
      offers,
      rejections,
    };
  }, [jobs]);

  /*
   * Search, filter and sort jobs
   */
  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = jobs.filter((job) => {
      const matchesSearch =
        !query ||
        job.company
          .toLowerCase()
          .includes(query) ||
        job.position
          .toLowerCase()
          .includes(query) ||
        job.location
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        job.status === statusFilter;

      const matchesType =
        typeFilter === "all" ||
        job.type === typeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });

    return [...result].sort((a, b) => {
      if (sortBy === "company") {
        return a.company.localeCompare(b.company);
      }

      const dateA = new Date(
        a.appliedDate
      ).getTime();

      const dateB = new Date(
        b.appliedDate
      ).getTime();

      if (
        Number.isNaN(dateA) ||
        Number.isNaN(dateB)
      ) {
        return 0;
      }

      return sortBy === "newest"
        ? dateB - dateA
        : dateA - dateB;
    });
  }, [
    jobs,
    search,
    statusFilter,
    typeFilter,
    sortBy,
  ]);

  const hasFilters =
    search.trim() !== "" ||
    statusFilter !== "all" ||
    typeFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  /*
   * Delete job
   */
      const handleDelete = async (id: string) => {
      const confirmed = window.confirm(
        "Are you sure you want to delete this job?"
      );

      if (!confirmed) {
        return;
      }

      try {
        await deleteJob(id);

        if (selectedJob?.id === id) {
          setSelectedJob(null);
        }

        const params = new URLSearchParams(
          window.location.search
        );

        if (params.get("job") === id) {
          router.replace("/jobs", {
            scroll: false,
          });
        }

        showToast(
          "Job removed successfully",
          "success"
        );
      } catch (error) {
        console.error(
          "Failed to delete job:",
          error
        );

        showToast(
          error instanceof Error
            ? error.message
            : "Unable to remove job. Please try again.",
          "error"
        );
      }
    };

  /*
   * Statistics cards
   */
  const statsCards = [
    {
      label: "Total opportunities",
      value: stats.total,
      icon: BriefcaseBusiness,
      color: "#8b5cf6",
    },

    {
      label: "Applications",
      value: stats.applications,
      icon: CheckCircle2,
      color: "#3b82f6",
    },

    {
      label: "Interviews",
      value: stats.interviews,
      icon: CalendarDays,
      color: "#ec4899",
    },

    {
      label: "Offers",
      value: stats.offers,
      icon: Trophy,
      color: "#10b981",
    },
  ];

  /*
   * Close selected job modal
   */
  const closeJobDetails = () => {
    setSelectedJob(null);

    /*
     * Remove ?job=... from the URL
     */
    if (window.location.search) {
      router.replace("/jobs", {
        scroll: false,
      });
    }
  };

  return (
    <>
      <main
        className="min-h-screen px-4 pb-10 sm:px-6 lg:px-8"
      >
        <div className="mx-auto w-full max-w-[1600px]">
          {/* Header */}
          <section className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <button
                type="button"
                onClick={() => router.back()}
                className="mb-5 flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all duration-200 hover:-translate-x-1"
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

              <p
                className="text-sm"
                style={{
                  color: "var(--text-muted)",
                }}
              >
                Your opportunities
              </p>

              <h1
                className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl"
                style={{
                  color: "var(--text-primary)",
                }}
              >
                Jobs
              </h1>

              <p
                className="mt-2 max-w-xl text-sm sm:text-base"
                style={{
                  color: "var(--text-secondary)",
                }}
              >
                Track every opportunity from
                discovery to offer.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddJob(true)}
              className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
              style={{
                color: "#fff",
                background: "var(--accent)",
                boxShadow:
                  "0 12px 35px rgba(139, 92, 246, 0.22)",
              }}
            >
              <Plus size={17} />
              Add Job
            </button>
          </section>

          {/* Stats */}
          <section className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {statsCards.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="glass rounded-3xl p-4 sm:p-5"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{
                        background: `${stat.color}18`,
                        color: stat.color,
                      }}
                    >
                      <Icon
                        size={18}
                        strokeWidth={1.8}
                      />
                    </div>

                    <span
                      className="text-2xl font-semibold"
                      style={{
                        color: "var(--text-primary)",
                      }}
                    >
                      {stat.value}
                    </span>
                  </div>

                  <p
                    className="mt-4 text-xs sm:text-sm"
                    style={{
                      color: "var(--text-secondary)",
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </section>

          {/* Search + Filters */}
          <section className="glass mt-7 rounded-3xl p-4">
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{
                    color: "var(--text-muted)",
                  }}
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search company, position or location..."
                  className="h-11 w-full rounded-2xl border pl-11 pr-4 text-sm outline-none transition"
                  style={{
                    color: "var(--text-primary)",
                    background: "var(--glass)",
                    borderColor:
                      "var(--glass-border)",
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowFilters(
                    (current) => !current
                  )
                }
                className="flex h-11 items-center justify-center gap-2 rounded-2xl border px-4 text-sm transition"
                style={{
                  color: "var(--text-secondary)",
                  background: "var(--glass)",
                  borderColor:
                    "var(--glass-border)",
                }}
              >
                <SlidersHorizontal size={16} />

                Filters

                {hasFilters && (
                  <span
                    className="flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold"
                    style={{
                      color: "#fff",
                      background:
                        "var(--accent)",
                    }}
                  >
                    !
                  </span>
                )}
              </button>
            </div>

            {showFilters && (
              <div
                className="mt-3 grid gap-3 border-t pt-3 md:grid-cols-3"
                style={{
                  borderColor:
                    "var(--glass-border)",
                }}
              >
                {/* Status */}
                <div>
                  <label
                    className="mb-2 block text-xs"
                    style={{
                      color: "var(--text-muted)",
                    }}
                  >
                    Status
                  </label>

                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(
                        event.target.value as
                          | JobStatus
                          | "all"
                      )
                    }
                    className="h-11 w-full rounded-2xl border px-4 text-sm outline-none"
                    style={{
                      color: "var(--text-primary)",
                      background:
                        "var(--background)",
                      borderColor:
                        "var(--glass-border)",
                    }}
                  >
                    {statuses.map((status) => (
                      <option
                        key={status.value}
                        value={status.value}
                      >
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label
                    className="mb-2 block text-xs"
                    style={{
                      color: "var(--text-muted)",
                    }}
                  >
                    Job type
                  </label>

                  <select
                    value={typeFilter}
                    onChange={(event) =>
                      setTypeFilter(
                        event.target.value as
                          | JobType
                          | "all"
                      )
                    }
                    className="h-11 w-full rounded-2xl border px-4 text-sm outline-none"
                    style={{
                      color: "var(--text-primary)",
                      background:
                        "var(--background)",
                      borderColor:
                        "var(--glass-border)",
                    }}
                  >
                    {jobTypes.map((type) => (
                      <option
                        key={type.value}
                        value={type.value}
                      >
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label
                    className="mb-2 block text-xs"
                    style={{
                      color: "var(--text-muted)",
                    }}
                  >
                    Sort by
                  </label>

                  <select
                    value={sortBy}
                    onChange={(event) =>
                      setSortBy(
                        event.target.value as SortOption
                      )
                    }
                    className="h-11 w-full rounded-2xl border px-4 text-sm outline-none"
                    style={{
                      color: "var(--text-primary)",
                      background:
                        "var(--background)",
                      borderColor:
                        "var(--glass-border)",
                    }}
                  >
                    <option value="newest">
                      Newest first
                    </option>

                    <option value="oldest">
                      Oldest first
                    </option>

                    <option value="company">
                      Company A-Z
                    </option>
                  </select>
                </div>
              </div>
            )}
          </section>

          {/* Result bar */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Filter
                size={15}
                style={{
                  color: "var(--text-muted)",
                }}
              />

              <p
                className="text-sm"
                style={{
                  color: "var(--text-muted)",
                }}
              >
                Showing{" "}
                <span
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  {isLoading
                    ? "—"
                    : filteredJobs.length}
                </span>{" "}
                of {isLoading ? "—" : jobs.length}{" "}
                {jobs.length === 1
                  ? "opportunity"
                  : "opportunities"}
              </p>
            </div>

            {hasFilters && !isLoading && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-sm transition hover:opacity-70"
                style={{
                  color: "var(--accent)",
                }}
              >
                <X size={14} />
                Clear filters
              </button>
            )}
          </div>

          {/* Jobs */}
          <section className="mt-4 space-y-3">
            {isLoading ? (
              <>
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="glass rounded-3xl p-5"
                  >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                      {/* Company icon skeleton */}
                      <div
                        className="h-12 w-12 shrink-0 animate-pulse rounded-2xl"
                        style={{
                          background:
                            "var(--glass)",
                        }}
                      />

                      {/* Job information skeleton */}
                      <div className="min-w-0 flex-1 space-y-3">
                        <div
                          className="h-5 w-48 animate-pulse rounded-lg"
                          style={{
                            background:
                              "var(--glass)",
                          }}
                        />

                        <div className="flex flex-wrap gap-3">
                          <div
                            className="h-4 w-28 animate-pulse rounded-md"
                            style={{
                              background:
                                "var(--glass)",
                            }}
                          />

                          <div
                            className="h-4 w-24 animate-pulse rounded-md"
                            style={{
                              background:
                                "var(--glass)",
                            }}
                          />

                          <div
                            className="h-4 w-20 animate-pulse rounded-md"
                            style={{
                              background:
                                "var(--glass)",
                            }}
                          />
                        </div>
                      </div>

                      {/* Status skeleton */}
                      <div
                        className="h-7 w-20 animate-pulse rounded-full"
                        style={{
                          background:
                            "var(--glass)",
                        }}
                      />

                      {/* Date skeleton */}
                      <div className="hidden shrink-0 space-y-2 sm:block">
                        <div
                          className="h-3 w-12 animate-pulse rounded-md"
                          style={{
                            background:
                              "var(--glass)",
                          }}
                        />

                        <div
                          className="h-4 w-24 animate-pulse rounded-md"
                          style={{
                            background:
                              "var(--glass)",
                          }}
                        />
                      </div>

                      {/* Actions skeleton */}
                      <div className="flex shrink-0 gap-2">
                        <div
                          className="h-10 w-10 animate-pulse rounded-xl"
                          style={{
                            background:
                              "var(--glass)",
                          }}
                        />

                        <div
                          className="h-10 w-10 animate-pulse rounded-xl"
                          style={{
                            background:
                              "var(--glass)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : error ? (
              <div className="glass rounded-3xl px-6 py-16 text-center">
                <div
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{
                    background:
                      "rgba(251, 113, 133, 0.12)",
                    color: "#fb7185",
                  }}
                >
                  <X size={22} />
                </div>

                <h3
                  className="mt-4 text-lg font-semibold"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  Unable to load jobs
                </h3>

                <p
                  className="mx-auto mt-2 max-w-md text-sm"
                  style={{
                    color: "var(--text-muted)",
                  }}
                >
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    window.location.reload()
                  }
                  className="mt-6 rounded-2xl px-5 py-3 text-sm font-medium transition hover:scale-[1.02]"
                  style={{
                    color: "#fff",
                    background: "var(--accent)",
                  }}
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                {filteredJobs.map((job) => {
                  const status =
                    statusConfig[job.status];

                  return (
                    <article
                      key={job.id}
                      className="glass rounded-3xl p-5 transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                        {/* Company icon */}
                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                          style={{
                            background:
                              "var(--accent-soft)",
                            color:
                              "var(--accent)",
                          }}
                        >
                          <BriefcaseBusiness
                            size={20}
                            strokeWidth={1.8}
                          />
                        </div>

                        {/* Job information */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2
                              className="text-base font-semibold"
                              style={{
                                color:
                                  "var(--text-primary)",
                              }}
                            >
                              {job.position}
                            </h2>

                            {job.salary && (
                              <span
                                className="rounded-full px-2.5 py-1 text-[11px]"
                                style={{
                                  color:
                                    "var(--text-secondary)",
                                  background:
                                    "var(--glass)",
                                  border:
                                    "1px solid var(--glass-border)",
                                }}
                              >
                                {job.salary}
                              </span>
                            )}
                          </div>

                          <div
                            className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm"
                            style={{
                              color:
                                "var(--text-secondary)",
                            }}
                          >
                            <span className="font-medium">
                              {job.company}
                            </span>

                            <span className="flex items-center gap-1">
                              <MapPin size={13} />
                              {job.location}
                            </span>

                            <span className="capitalize">
                              {job.type}
                            </span>
                          </div>
                        </div>

                        {/* Status */}
                        <span
                          className="w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-medium"
                          style={{
                            color: status.color,
                            background:
                              status.background,
                          }}
                        >
                          {status.label}
                        </span>

                        {/* Date */}
                        <div className="shrink-0">
                          <p
                            className="text-[11px]"
                            style={{
                              color:
                                "var(--text-muted)",
                            }}
                          >
                            Applied
                          </p>

                          <p
                            className="mt-0.5 text-xs"
                            style={{
                              color:
                                "var(--text-secondary)",
                            }}
                          >
                            {job.appliedDate}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedJob(job)
                            }
                            className="rounded-xl p-2.5 transition hover:scale-105 hover:bg-[color:var(--surface-hover)]"
                            style={{
                              color:
                                "var(--text-secondary)",
                            }}
                            aria-label={`View ${job.position}`}
                            title="View details"
                          >
                            <ArrowUpRight
                              size={18}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(job.id)
                            }
                            className="rounded-xl p-2.5 transition hover:scale-105 hover:bg-[color:var(--surface-hover)]"
                            style={{
                              color:
                                "var(--text-muted)",
                            }}
                            aria-label={`Delete ${job.position}`}
                            title="Delete job"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}

                {/* Empty state */}
                {filteredJobs.length === 0 && (
                  <div className="glass rounded-3xl px-6 py-16 text-center">
                    <div
                      className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
                      style={{
                        background:
                          "var(--accent-soft)",
                        color:
                          "var(--accent)",
                      }}
                    >
                      <Search size={22} />
                    </div>

                    <h3
                      className="mt-4 text-lg font-semibold"
                      style={{
                        color:
                          "var(--text-primary)",
                      }}
                    >
                      {jobs.length === 0
                        ? "No jobs added yet"
                        : "No jobs found"}
                    </h3>

                    <p
                      className="mx-auto mt-2 max-w-md text-sm"
                      style={{
                        color:
                          "var(--text-muted)",
                      }}
                    >
                      {jobs.length === 0
                        ? "Start building your job pipeline by adding your first opportunity."
                        : "Try changing your search or filters to find what you're looking for."}
                    </p>

                    {jobs.length === 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setShowAddJob(true)
                        }
                        className="mt-6 inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium transition hover:scale-[1.02]"
                        style={{
                          color: "#fff",
                          background:
                            "var(--accent)",
                        }}
                      >
                        <Plus size={17} />
                        Add your first job
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      {/* Add Job Modal */}
      <AddJobModal
        open={showAddJob}
        onClose={() => setShowAddJob(false)}
      />

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        onClose={closeJobDetails}
      />
    </>
  );
}