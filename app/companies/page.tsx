"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Search,
  Trophy,
  XCircle,
} from "lucide-react";

/* ---------------- Types ---------------- */

interface CompanyJob {
  id: string;
  company: string;
  position: string;
  location: string;
  type: string;
  status: string;
  appliedDate: string;
  salary?: string;
  jobUrl?: string;
  recruiter?: string;
  recruiterEmail?: string;
  interviewDate?: string;
  notes?: string;
}

interface CompanyStats {
  company: string;
  applications: number;
  interviews: number;
  offers: number;
  rejected: number;
  saved: number;
  screening: number;
  withdrawn: number;
  jobs: CompanyJob[];
}

interface CompaniesResponse {
  totalCompanies: number;
  totalApplications: number;
  companies: CompanyStats[];
}

/* ---------------- Helpers ---------------- */

function formatDate(dateString?: string) {
  if (!dateString) return "—";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(dateString?: string) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getInitials(company: string) {
  const words = company
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 1) {
    return words[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    words[0][0] +
    words[words.length - 1][0]
  ).toUpperCase();
}

function getCompanyColor(index: number) {
  const colors = [
    "#8b5cf6",
    "#3b82f6",
    "#ec4899",
    "#10b981",
    "#f59e0b",
    "#06b6d4",
  ];

  return colors[index % colors.length];
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

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    saved: "Saved",
    applied: "Applied",
    screening: "Screening",
    interview: "Interview",
    offer: "Offer",
    rejected: "Rejected",
    withdrawn: "Withdrawn",
  };

  return labels[status] || status;
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    saved: "#8b5cf6",
    applied: "#3b82f6",
    screening: "#f59e0b",
    interview: "#ec4899",
    offer: "#10b981",
    rejected: "#fb7185",
    withdrawn: "#64748b",
  };

  return colors[status] || "#8b5cf6";
}

/* ---------------- Page ---------------- */

export default function CompaniesPage() {
  const router = useRouter();

  const [data, setData] =
    useState<CompaniesResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [selectedCompany, setSelectedCompany] =
    useState<CompanyStats | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCompanies() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/companies/stats",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          const result =
            await response
              .json()
              .catch(() => null);

          throw new Error(
            result?.message ||
              "Failed to load companies."
          );
        }

        const result =
          (await response.json()) as CompaniesResponse;

        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        console.error(
          "Companies loading error:",
          err
        );

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load companies."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCompanies();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredCompanies = useMemo(() => {
    if (!data?.companies) return [];

    const query =
      search.trim().toLowerCase();

    if (!query) {
      return data.companies;
    }

    return data.companies.filter(
      (company) =>
        company.company
          .toLowerCase()
          .includes(query) ||
        company.jobs.some(
          (job) =>
            job.position
              .toLowerCase()
              .includes(query) ||
            job.location
              .toLowerCase()
              .includes(query)
        )
    );
  }, [data, search]);

  const companiesWithInterviews =
    data?.companies.filter(
      (company) => company.interviews > 0
    ).length || 0;

  const companiesWithOffers =
    data?.companies.filter(
      (company) => company.offers > 0
    ).length || 0;

  const companiesWithRejections =
    data?.companies.filter(
      (company) => company.rejected > 0
    ).length || 0;

  /* ---------------- Loading ---------------- */

  if (loading) {
    return (
      <main
        className="min-h-screen px-4 pb-12 sm:px-6 lg:px-8"
        
      >
        <div className="mx-auto w-full max-w-[1600px] animate-pulse">
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

          <div className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-2">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="glass h-72 rounded-3xl"
                />
              )
            )}
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
              Unable to load companies
            </h1>

            <p
              className="mt-2 text-sm"
              style={{
                color: "var(--text-muted)",
              }}
            >
              {error ||
                "Something went wrong while loading your companies."}
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

  return (
    <>
      <main
        className="min-h-screen px-4 pb-12 sm:px-6 lg:px-8"
        
      >
        <div className="mx-auto w-full max-w-[1600px]">
          {/* Header */}

          <section>
            <button
              type="button"
              onClick={() => router.back()}
              className="mb-6 flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all duration-200 hover:-translate-x-1"
              style={{
                color:
                  "var(--text-secondary)",
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
                    color:
                      "var(--text-muted)",
                  }}
                >
                  Your company pipeline
                </p>

                <h1
                  className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl"
                  style={{
                    color:
                      "var(--text-primary)",
                  }}
                >
                  Companies
                </h1>

                <p
                  className="mt-3 max-w-2xl text-sm sm:text-base"
                  style={{
                    color:
                      "var(--text-secondary)",
                  }}
                >
                  See where you have applied,
                  which companies are moving
                  forward, and where your
                  opportunities stand.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  router.push("/jobs")
                }
                className="flex w-fit items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition hover:-translate-y-0.5"
                style={{
                  background:
                    "var(--accent)",
                  color: "#ffffff",
                }}
              >
                View all jobs
                <ArrowUpRight size={16} />
              </button>
            </div>
          </section>

          {/* Overview */}

          <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <OverviewCard
              label="Companies"
              value={data.totalCompanies}
              description="Companies being tracked"
              icon={Building2}
            />

            <OverviewCard
              label="Applications"
              value={data.totalApplications}
              description="Total tracked applications"
              icon={BriefcaseBusiness}
            />

            <OverviewCard
              label="With interviews"
              value={companiesWithInterviews}
              description="Companies reaching interviews"
              icon={CalendarDays}
            />

            <OverviewCard
              label="With offers"
              value={companiesWithOffers}
              description="Companies with offers"
              icon={Trophy}
            />
          </section>

          {/* Search */}

          <section className="mt-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p
                  className="text-sm"
                  style={{
                    color:
                      "var(--text-muted)",
                  }}
                >
                  Company overview
                </p>

                <h2
                  className="mt-1 text-xl font-semibold"
                  style={{
                    color:
                      "var(--text-primary)",
                  }}
                >
                  Your Companies
                </h2>
              </div>

              <div
                className="flex w-full max-w-md items-center gap-2 rounded-2xl px-4 py-3"
                style={{
                  background:
                    "var(--glass)",
                  border:
                    "1px solid var(--glass-border)",
                }}
              >
                <Search
                  size={16}
                  style={{
                    color:
                      "var(--text-muted)",
                  }}
                />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search companies, roles or locations..."
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                  style={{
                    color:
                      "var(--text-primary)",
                  }}
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="text-xs"
                    style={{
                      color:
                        "var(--text-muted)",
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Company List */}

          <section className="mt-5">
            {filteredCompanies.length === 0 ? (
              <EmptyState
                searching={Boolean(search)}
                onJobs={() =>
                  router.push("/jobs")
                }
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {filteredCompanies.map(
                  (company, index) => (
                    <CompanyCard
                      key={company.company}
                      company={company}
                      color={getCompanyColor(
                        index
                      )}
                      onOpen={() =>
                        setSelectedCompany(
                          company
                        )
                      }
                    />
                  )
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Company Details Modal */}

      {selectedCompany && (
        <CompanyDetailsModal
          company={selectedCompany}
          onClose={() =>
            setSelectedCompany(null)
          }
          onJobs={() =>
            router.push("/jobs")
          }
        />
      )}
    </>
  );
}

/* ---------------- Company Card ---------------- */

function CompanyCard({
  company,
  color,
  onOpen,
}: {
  company: CompanyStats;
  color: string;
  onOpen: () => void;
}) {
  const total =
    company.applications +
    company.saved +
    company.withdrawn;

  const pipelineTotal =
    company.applications;

  return (
    <div className="glass rounded-3xl p-5 transition-all duration-200 hover:-translate-y-0.5 sm:p-6">
      <div className="flex items-start gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold"
          style={{
            background: `${color}18`,
            color,
            border: `1px solid ${color}30`,
          }}
        >
          {getInitials(
            company.company
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className="truncate text-base font-semibold"
            style={{
              color:
                "var(--text-primary)",
            }}
          >
            {company.company}
          </h3>

          <div
            className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs"
            style={{
              color:
                "var(--text-muted)",
            }}
          >
            <span>
              {company.jobs.length}{" "}
              {company.jobs.length === 1
                ? "role"
                : "roles"}
            </span>

            {company.jobs[0]?.location && (
              <>
                <span>•</span>

                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {company.jobs[0].location}
                </span>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition hover:scale-105"
          style={{
            background:
              "var(--glass)",
            border:
              "1px solid var(--glass-border)",
            color:
              "var(--text-secondary)",
          }}
          title="View company"
          aria-label={`View ${company.company}`}
        >
          <ArrowUpRight size={16} />
        </button>
      </div>

      {/* Stats */}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <CompanyMetric
          label="Applications"
          value={company.applications}
          icon={BriefcaseBusiness}
        />

        <CompanyMetric
          label="Screening"
          value={company.screening}
          icon={Clock3}
        />

        <CompanyMetric
          label="Interviews"
          value={company.interviews}
          icon={CalendarDays}
        />

        <CompanyMetric
          label="Offers"
          value={company.offers}
          icon={Trophy}
        />
      </div>

      {/* Pipeline */}

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <span
            className="text-xs"
            style={{
              color:
                "var(--text-muted)",
            }}
          >
            Pipeline
          </span>

          <span
            className="text-xs"
            style={{
              color:
                "var(--text-muted)",
            }}
          >
            Latest{" "}
            {formatDate(
              company.jobs[0]
                ?.appliedDate
            )}
          </span>
        </div>

        <div className="mt-2 flex h-2 overflow-hidden rounded-full">
          {company.saved > 0 && (
            <PipelineSegment
              value={company.saved}
              total={total}
              color="#8b5cf6"
            />
          )}

          {company.screening > 0 && (
            <PipelineSegment
              value={company.screening}
              total={pipelineTotal}
              color="#f59e0b"
            />
          )}

          {company.interviews > 0 && (
            <PipelineSegment
              value={company.interviews}
              total={pipelineTotal}
              color="#ec4899"
            />
          )}

          {company.offers > 0 && (
            <PipelineSegment
              value={company.offers}
              total={pipelineTotal}
              color="#10b981"
            />
          )}

          {company.rejected > 0 && (
            <PipelineSegment
              value={company.rejected}
              total={pipelineTotal}
              color="#fb7185"
            />
          )}

          {company.applications -
            company.screening -
            company.interviews -
            company.offers -
            company.rejected >
            0 && (
            <PipelineSegment
              value={
                Math.max(
                  company.applications -
                    company.screening -
                    company.interviews -
                    company.offers -
                    company.rejected,
                  0
                )
              }
              total={pipelineTotal}
              color="#3b82f6"
            />
          )}

          {total === 0 && (
            <div
              className="h-full w-full"
              style={{
                background:
                  "var(--glass)",
              }}
            />
          )}
        </div>
      </div>

      {/* Bottom */}

      <div
        className="mt-5 flex items-center justify-between border-t pt-4"
        style={{
          borderColor:
            "var(--glass-border)",
        }}
      >
        <div className="flex flex-wrap gap-2">
          {company.offers > 0 && (
            <StatusBadge
              label={`${company.offers} ${
                company.offers === 1
                  ? "offer"
                  : "offers"
              }`}
              color="#10b981"
            />
          )}

          {company.interviews > 0 && (
            <StatusBadge
              label={`${company.interviews} ${
                company.interviews === 1
                  ? "interview"
                  : "interviews"
              }`}
              color="#ec4899"
            />
          )}

          {company.rejected > 0 && (
            <StatusBadge
              label={`${company.rejected} rejected`}
              color="#fb7185"
            />
          )}

          {company.screening > 0 && (
            <StatusBadge
              label={`${company.screening} screening`}
              color="#f59e0b"
            />
          )}

          {company.applications === 0 &&
            company.saved > 0 && (
              <StatusBadge
                label={`${company.saved} saved`}
                color="#8b5cf6"
              />
            )}
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="flex items-center gap-1 text-xs font-medium transition hover:gap-2"
          style={{
            color: "var(--accent)",
          }}
        >
          View details
          <ArrowUpRight size={13} />
        </button>
      </div>
    </div>
  );
}

/* ---------------- Pipeline Segment ---------------- */

function PipelineSegment({
  value,
  total,
  color,
}: {
  value: number;
  total: number;
  color: string;
}) {
  if (!total || !value) return null;

  return (
    <div
      style={{
        width: `${Math.min(
          (value / total) * 100,
          100
        )}%`,
        background: color,
      }}
    />
  );
}

/* ---------------- Company Details ---------------- */

function CompanyDetailsModal({
  company,
  onClose,
  onJobs,
}: {
  company: CompanyStats;
  onClose: () => void;
  onJobs: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[color:var(--overlay)] p-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className="glass max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl"
        style={{
          border:
            "1px solid var(--glass-border)",
          boxShadow:
            "0 30px 100px rgba(0,0,0,0.30)",
        }}
      >
        {/* Header */}

        <div
          className="flex items-start justify-between border-b p-5 sm:p-6"
          style={{
            borderColor:
              "var(--glass-border)",
          }}
        >
          <div className="min-w-0">
            <p
              className="text-xs"
              style={{
                color:
                  "var(--text-muted)",
              }}
            >
              Company
            </p>

            <h2
              className="mt-1 truncate text-xl font-semibold sm:text-2xl"
              style={{
                color:
                  "var(--text-primary)",
              }}
            >
              {company.company}
            </h2>

            <p
              className="mt-1 text-sm"
              style={{
                color:
                  "var(--text-secondary)",
              }}
            >
              {company.jobs.length}{" "}
              {company.jobs.length === 1
                ? "role"
                : "roles"}{" "}
              tracked
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg"
            style={{
              background:
                "var(--glass)",
              color:
                "var(--text-secondary)",
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Summary */}

        <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4 sm:p-6">
          <MiniStat
            label="Applications"
            value={company.applications}
          />

          <MiniStat
            label="Screening"
            value={company.screening}
          />

          <MiniStat
            label="Interviews"
            value={company.interviews}
          />

          <MiniStat
            label="Offers"
            value={company.offers}
          />
        </div>

        {/* Jobs */}

        <div className="max-h-[45vh] overflow-y-auto px-5 pb-5 sm:px-6 sm:pb-6">
          <div className="space-y-3">
            {company.jobs.map((job) => {
              const statusColor =
                getStatusColor(job.status);

              return (
                <div
                  key={job.id}
                  className="rounded-2xl p-4"
                  style={{
                    background:
                      "var(--glass)",
                    border:
                      "1px solid var(--glass-border)",
                  }}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3
                        className="text-sm font-semibold"
                        style={{
                          color:
                            "var(--text-primary)",
                        }}
                      >
                        {job.position}
                      </h3>

                      <div
                        className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs"
                        style={{
                          color:
                            "var(--text-muted)",
                        }}
                      >
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {job.location}
                          </span>
                        )}

                        {job.type && (
                          <span>
                            {formatJobType(
                              job.type
                            )}
                          </span>
                        )}

                        <span>
                          Applied{" "}
                          {formatDate(
                            job.appliedDate
                          )}
                        </span>
                      </div>
                    </div>

                    <StatusBadge
                      label={getStatusLabel(
                        job.status
                      )}
                      color={statusColor}
                    />
                  </div>

                  {job.interviewDate && (
                    <div
                      className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-xs"
                      style={{
                        background:
                          "rgba(236,72,153,0.08)",
                        color: "#ec4899",
                      }}
                    >
                      <CalendarDays size={14} />

                      Interview{" "}
                      {formatDateTime(
                        job.interviewDate
                      )}
                    </div>
                  )}

                  {job.salary && (
                    <p
                      className="mt-3 text-xs"
                      style={{
                        color:
                          "var(--text-secondary)",
                      }}
                    >
                      Salary: {job.salary}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}

        <div
          className="flex flex-col-reverse gap-3 border-t p-5 sm:flex-row sm:justify-end sm:p-6"
          style={{
            borderColor:
              "var(--glass-border)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm"
            style={{
              background:
                "var(--glass)",
              color:
                "var(--text-secondary)",
              border:
                "1px solid var(--glass-border)",
            }}
          >
            Close
          </button>

          <button
            type="button"
            onClick={onJobs}
            className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium"
            style={{
              background:
                "var(--accent)",
              color: "#ffffff",
            }}
          >
            Open jobs
            <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Mini Stat ---------------- */

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div
      className="rounded-2xl p-3"
      style={{
        background:
          "var(--glass)",
      }}
    >
      <p
        className="text-xs"
        style={{
          color:
            "var(--text-muted)",
        }}
      >
        {label}
      </p>

      <p
        className="mt-1 text-xl font-semibold"
        style={{
          color:
            "var(--text-primary)",
        }}
      >
        {value}
      </p>
    </div>
  );
}

/* ---------------- Company Metric ---------------- */

function CompanyMetric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof BriefcaseBusiness;
}) {
  return (
    <div
      className="rounded-2xl p-3"
      style={{
        background:
          "var(--glass)",
      }}
    >
      <div className="flex items-center justify-between">
        <Icon
          size={14}
          style={{
            color:
              "var(--accent)",
          }}
        />

        <span
          className="text-sm font-semibold"
          style={{
            color:
              "var(--text-primary)",
          }}
        >
          {value}
        </span>
      </div>

      <p
        className="mt-2 text-[11px]"
        style={{
          color:
            "var(--text-muted)",
        }}
      >
        {label}
      </p>
    </div>
  );
}

/* ---------------- Overview Card ---------------- */

function OverviewCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: number;
  description: string;
  icon: typeof Building2;
}) {
  return (
    <div className="glass rounded-3xl p-5 sm:p-6">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl"
        style={{
          background:
            "var(--accent-soft)",
          color:
            "var(--accent)",
        }}
      >
        <Icon size={18} />
      </div>

      <p
        className="mt-5 text-sm"
        style={{
          color:
            "var(--text-secondary)",
        }}
      >
        {label}
      </p>

      <p
        className="mt-1 text-3xl font-semibold"
        style={{
          color:
            "var(--text-primary)",
        }}
      >
        {value}
      </p>

      <p
        className="mt-2 text-xs"
        style={{
          color:
            "var(--text-muted)",
        }}
      >
        {description}
      </p>
    </div>
  );
}

/* ---------------- Status Badge ---------------- */

function StatusBadge({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <span
      className="rounded-full px-2.5 py-1 text-[11px] font-medium"
      style={{
        background: `${color}15`,
        color,
      }}
    >
      {label}
    </span>
  );
}

/* ---------------- Empty State ---------------- */

function EmptyState({
  searching,
  onJobs,
}: {
  searching: boolean;
  onJobs: () => void;
}) {
  return (
    <div className="glass rounded-3xl px-6 py-16 text-center">
      <div
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{
          background:
            "var(--accent-soft)",
          color:
            "var(--accent)",
        }}
      >
        {searching ? (
          <Search size={26} />
        ) : (
          <Building2 size={26} />
        )}
      </div>

      <h2
        className="mt-5 text-xl font-semibold"
        style={{
          color:
            "var(--text-primary)",
        }}
      >
        {searching
          ? "No companies found"
          : "No companies yet"}
      </h2>

      <p
        className="mx-auto mt-2 max-w-md text-sm"
        style={{
          color:
            "var(--text-muted)",
        }}
      >
        {searching
          ? "Try searching with another company name, role, or location."
          : "Companies will automatically appear here when you start adding jobs to JobTrack."}
      </p>

      {!searching && (
        <button
          type="button"
          onClick={onJobs}
          className="mt-6 rounded-xl px-5 py-3 text-sm font-medium transition hover:-translate-y-0.5"
          style={{
            background:
              "var(--accent)",
            color: "#ffffff",
          }}
        >
          Add a job
        </button>
      )}
    </div>
  );
}