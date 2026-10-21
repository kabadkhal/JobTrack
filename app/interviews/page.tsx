"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Mail,
  MapPin,
  UserRound,
  Video,
} from "lucide-react";

import { useJobs } from "@/context/JobContext";
import type { Job } from "@/types/job";

/* ---------------- Helpers ---------------- */

const DAY_MS = 1000 * 60 * 60 * 24;

function parseInterviewDate(dateString?: string) {
  if (!dateString) return null;

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function startOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

function isSameDay(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function formatInterviewDate(dateString: string) {
  const date = parseInterviewDate(dateString);

  if (!date) return "Invalid date";

  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatInterviewTime(dateString: string) {
  const date = parseInterviewDate(dateString);

  if (!date) return "Invalid time";

  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getCalendarDayDifference(dateString: string) {
  const interviewDate = parseInterviewDate(dateString);

  if (!interviewDate) return null;

  const today = startOfDay(new Date());
  const interviewDay = startOfDay(interviewDate);

  return Math.round(
    (interviewDay.getTime() - today.getTime()) / DAY_MS
  );
}

function getRelativeLabel(dateString: string) {
  const date = parseInterviewDate(dateString);

  if (!date) return "Unknown";

  const now = new Date();
  const difference = getCalendarDayDifference(dateString);

  if (difference === null) return "Unknown";

  if (difference === 0) {
    if (date.getTime() < now.getTime()) {
      return "Earlier today";
    }

    return "Today";
  }

  if (difference === 1) {
    return "Tomorrow";
  }

  if (difference > 1) {
    return `In ${difference} days`;
  }

  if (difference === -1) {
    return "Yesterday";
  }

  return `${Math.abs(difference)} days ago`;
}

/* ---------------- Page ---------------- */

export default function InterviewsPage() {
  const router = useRouter();

  const { jobs, isLoading, error } = useJobs();

  /*
   * Only jobs that have an interview date are displayed.
   *
   * We keep the status check because the current JobTrack
   * interview workflow marks scheduled interviews as
   * status === "interview".
   */
  const interviews = useMemo(() => {
    return jobs
      .filter((job) => {
        if (!job.interviewDate) return false;

        const date = parseInterviewDate(job.interviewDate);

        if (!date) return false;

        return job.status === "interview";
      })
      .sort((a, b) => {
        const first = parseInterviewDate(a.interviewDate!)!;
        const second = parseInterviewDate(b.interviewDate!)!;

        return first.getTime() - second.getTime();
      });
  }, [jobs]);

  const upcomingInterviews = useMemo(() => {
    const now = Date.now();

    return interviews.filter((job) => {
      const date = parseInterviewDate(job.interviewDate!);

      return date ? date.getTime() >= now : false;
    });
  }, [interviews]);

  const pastInterviews = useMemo(() => {
    const now = Date.now();

    return interviews
      .filter((job) => {
        const date = parseInterviewDate(job.interviewDate!);

        return date ? date.getTime() < now : false;
      })
      .reverse();
  }, [interviews]);

  const nextInterview = upcomingInterviews[0];

  function openJob(job: Job) {
    router.push(
      `/jobs?job=${encodeURIComponent(job.id)}`
    );
  }

  return (
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
              color: "var(--text-secondary)",
              background: "var(--glass)",
              border: "1px solid var(--glass-border)",
            }}
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <p
            className="text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            Your interview schedule
          </p>

          <h1
            className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl"
            style={{ color: "var(--text-primary)" }}
          >
            Interviews
          </h1>

          <p
            className="mt-3 max-w-2xl text-sm sm:text-base"
            style={{ color: "var(--text-secondary)" }}
          >
            Keep track of upcoming interviews, important
            conversations, and your interview history.
          </p>
        </section>

        {/* Loading */}

        {isLoading && (
          <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="glass animate-pulse rounded-3xl p-6"
              >
                <div
                  className="h-10 w-10 rounded-xl"
                  style={{
                    background: "var(--glass-border)",
                  }}
                />

                <div
                  className="mt-5 h-4 w-24 rounded"
                  style={{
                    background: "var(--glass-border)",
                  }}
                />

                <div
                  className="mt-2 h-8 w-12 rounded"
                  style={{
                    background: "var(--glass-border)",
                  }}
                />
              </div>
            ))}
          </section>
        )}

        {/* Error */}

        {!isLoading && error && (
          <section className="mt-8">
            <div
              className="glass rounded-3xl p-6"
              style={{
                borderColor: "rgba(251, 113, 133, 0.3)",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: "rgba(251, 113, 133, 0.1)",
                    color: "#fb7185",
                  }}
                >
                  <BriefcaseBusiness size={18} />
                </div>

                <div>
                  <h2
                    className="font-semibold"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    Could not load interviews
                  </h2>

                  <p
                    className="mt-1 text-sm"
                    style={{
                      color: "var(--text-muted)",
                    }}
                  >
                    {error}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Main Content */}

        {!isLoading && !error && (
          <>
            {/* Stats */}

            <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard
                label="Upcoming"
                value={upcomingInterviews.length}
                icon={CalendarDays}
              />

              <StatCard
                label="Total interviews"
                value={interviews.length}
                icon={Video}
              />

              <StatCard
                label="Completed"
                value={pastInterviews.length}
                icon={CheckCircle2}
              />
            </section>

            {/* Next Interview */}

            {nextInterview && (
              <section className="mt-8">
                <div
                  className="glass overflow-hidden rounded-3xl p-6 sm:p-7"
                  style={{
                    borderColor:
                      "rgba(139, 92, 246, 0.28)",
                  }}
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{
                            background: "var(--accent)",
                            boxShadow:
                              "0 0 14px var(--accent)",
                          }}
                        />

                        <p
                          className="text-xs font-medium uppercase tracking-[0.18em]"
                          style={{
                            color: "var(--accent)",
                          }}
                        >
                          Next interview
                        </p>
                      </div>

                      <h2
                        className="mt-4 text-2xl font-semibold"
                        style={{
                          color: "var(--text-primary)",
                        }}
                      >
                        {nextInterview.position}
                      </h2>

                      <p
                        className="mt-1 text-sm"
                        style={{
                          color: "var(--text-secondary)",
                        }}
                      >
                        {nextInterview.company}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-4">
                        <InfoPill
                          icon={CalendarDays}
                          text={formatInterviewDate(
                            nextInterview.interviewDate!
                          )}
                        />

                        <InfoPill
                          icon={Clock3}
                          text={formatInterviewTime(
                            nextInterview.interviewDate!
                          )}
                        />

                        <InfoPill
                          icon={MapPin}
                          text={
                            nextInterview.location ||
                            "Location not set"
                          }
                        />
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                      <div
                        className="rounded-2xl px-5 py-4 text-center"
                        style={{
                          background:
                            "var(--accent-soft)",
                        }}
                      >
                        <p
                          className="text-2xl font-semibold"
                          style={{
                            color: "var(--accent)",
                          }}
                        >
                          {getRelativeLabel(
                            nextInterview.interviewDate!
                          )}
                        </p>

                        <p
                          className="mt-1 text-xs"
                          style={{
                            color: "var(--text-muted)",
                          }}
                        >
                          until interview
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          openJob(nextInterview)
                        }
                        className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium transition hover:-translate-y-0.5"
                        style={{
                          background: "var(--accent)",
                          color: "#ffffff",
                        }}
                      >
                        View interview
                        <ArrowUpRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Upcoming Interviews */}

            <section className="mt-10">
              <div className="mb-5">
                <p
                  className="text-sm"
                  style={{
                    color: "var(--text-muted)",
                  }}
                >
                  Coming up
                </p>

                <h2
                  className="mt-1 text-xl font-semibold"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  Upcoming Interviews
                </h2>
              </div>

              {upcomingInterviews.length === 0 ? (
                <EmptyState
                  title="No upcoming interviews"
                  description="When you add an interview date to a job, it will appear here automatically."
                />
              ) : (
                <div className="space-y-4">
                  {upcomingInterviews.map((job) => (
                    <InterviewCard
                      key={job.id}
                      job={job}
                      upcoming
                      onOpen={() => openJob(job)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Interview History */}

            {pastInterviews.length > 0 && (
              <section className="mt-10">
                <div className="mb-5">
                  <p
                    className="text-sm"
                    style={{
                      color: "var(--text-muted)",
                    }}
                  >
                    History
                  </p>

                  <h2
                    className="mt-1 text-xl font-semibold"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    Completed Interviews
                  </h2>
                </div>

                <div className="space-y-4">
                  {pastInterviews.map((job) => (
                    <InterviewCard
                      key={job.id}
                      job={job}
                      upcoming={false}
                      onOpen={() => openJob(job)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Empty Overall State */}

            {interviews.length === 0 && (
              <section className="mt-10">
                <div className="glass rounded-3xl p-8 text-center sm:p-12">
                  <div
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl"
                    style={{
                      background:
                        "var(--accent-soft)",
                      color: "var(--accent)",
                    }}
                  >
                    <BriefcaseBusiness size={26} />
                  </div>

                  <h2
                    className="mt-5 text-xl font-semibold"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    No interviews scheduled yet
                  </h2>

                  <p
                    className="mx-auto mt-2 max-w-md text-sm"
                    style={{
                      color: "var(--text-muted)",
                    }}
                  >
                    Add an interview date to one of your
                    jobs and JobTrack will automatically
                    organize it here.
                  </p>

                  <button
                    type="button"
                    onClick={() => router.push("/jobs")}
                    className="mt-6 inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium transition hover:-translate-y-0.5"
                    style={{
                      background: "var(--accent)",
                      color: "#ffffff",
                    }}
                  >
                    Go to Jobs
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}

/* ---------------- Interview Card ---------------- */

function InterviewCard({
  job,
  upcoming,
  onOpen,
}: {
  job: Job;
  upcoming: boolean;
  onOpen: () => void;
}) {
  const interviewDate = job.interviewDate
    ? parseInterviewDate(job.interviewDate)
    : null;

  const calendarDifference = job.interviewDate
    ? getCalendarDayDifference(job.interviewDate)
    : null;

  return (
    <div
      className="glass rounded-3xl p-5 transition-all duration-200 hover:-translate-y-0.5 sm:p-6"
      style={{
        opacity: upcoming ? 1 : 0.78,
      }}
    >
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center">

        {/* Date Icon */}

        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
          style={{
            background: "var(--accent-soft)",
            color: "var(--accent)",
          }}
        >
          <CalendarDays
            size={21}
            strokeWidth={1.8}
          />
        </div>

        {/* Main Information */}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className="text-base font-semibold"
              style={{
                color: "var(--text-primary)",
              }}
            >
              {job.position}
            </h3>

            {!upcoming && (
              <span
                className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                style={{
                  background:
                    "rgba(52, 211, 153, 0.10)",
                  color: "var(--success)",
                }}
              >
                Completed
              </span>
            )}
          </div>

          <p
            className="mt-1 text-sm"
            style={{
              color: "var(--text-secondary)",
            }}
          >
            {job.company}
          </p>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {job.interviewDate && (
              <>
                <InfoPill
                  icon={CalendarDays}
                  text={formatInterviewDate(
                    job.interviewDate
                  )}
                />

                <InfoPill
                  icon={Clock3}
                  text={formatInterviewTime(
                    job.interviewDate
                  )}
                />
              </>
            )}

            <InfoPill
              icon={MapPin}
              text={job.location || "Location not set"}
            />

            {job.recruiter && (
              <InfoPill
                icon={UserRound}
                text={job.recruiter}
              />
            )}
          </div>
        </div>

        {/* Recruiter */}

        {job.recruiterEmail && (
          <a
            href={`mailto:${job.recruiterEmail}`}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs transition hover:-translate-y-0.5"
            style={{
              background: "var(--glass)",
              border:
                "1px solid var(--glass-border)",
              color: "var(--text-secondary)",
            }}
          >
            <Mail size={14} />
            Contact recruiter
          </a>
        )}

        {/* Countdown */}

        {upcoming &&
          calendarDifference !== null && (
            <div
              className="shrink-0 rounded-2xl px-4 py-3 text-center"
              style={{
                background: "var(--accent-soft)",
              }}
            >
              <p
                className="text-sm font-semibold"
                style={{
                  color: "var(--accent)",
                }}
              >
                {calendarDifference === 0
                  ? "Today"
                  : calendarDifference === 1
                  ? "Tomorrow"
                  : `${calendarDifference} days`}
              </p>

              {calendarDifference > 1 && (
                <p
                  className="mt-0.5 text-[11px]"
                  style={{
                    color: "var(--text-muted)",
                  }}
                >
                  remaining
                </p>
              )}
            </div>
          )}

        {/* Actions */}

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onOpen}
            className="rounded-xl px-3 py-2 text-xs font-medium transition hover:-translate-y-0.5"
            style={{
              background: "var(--glass)",
              border:
                "1px solid var(--glass-border)",
              color: "var(--text-secondary)",
            }}
          >
            View Job
          </button>

          {job.jobUrl && (
            <a
              href={job.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-xl transition hover:scale-105"
              style={{
                background: "var(--accent-soft)",
                color: "var(--accent)",
              }}
              aria-label="Open job posting"
              title="Open job posting"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>

      {/* Mobile interview timing */}

      {interviewDate && (
        <div
          className="mt-4 border-t pt-4 text-xs xl:hidden"
          style={{
            borderColor: "var(--glass-border)",
            color: "var(--text-muted)",
          }}
        >
          {getRelativeLabel(job.interviewDate!)}
        </div>
      )}
    </div>
  );
}

/* ---------------- Info Pill ---------------- */

function InfoPill({
  icon: Icon,
  text,
}: {
  icon: typeof CalendarDays;
  text: string;
}) {
  return (
    <span
      className="flex items-center gap-1.5 text-xs"
      style={{
        color: "var(--text-muted)",
      }}
    >
      <Icon size={13} />
      {text}
    </span>
  );
}

/* ---------------- Stat Card ---------------- */

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof CalendarDays;
}) {
  return (
    <div className="glass rounded-3xl p-5 sm:p-6">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl"
        style={{
          background: "var(--accent-soft)",
          color: "var(--accent)",
        }}
      >
        <Icon
          size={18}
          strokeWidth={1.8}
        />
      </div>

      <p
        className="mt-4 text-sm"
        style={{
          color: "var(--text-secondary)",
        }}
      >
        {label}
      </p>

      <p
        className="mt-1 text-2xl font-semibold"
        style={{
          color: "var(--text-primary)",
        }}
      >
        {value}
      </p>
    </div>
  );
}

/* ---------------- Empty State ---------------- */

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const router = useRouter();

  return (
    <div className="glass rounded-3xl px-6 py-16 text-center">
      <div
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{
          background: "var(--accent-soft)",
          color: "var(--accent)",
        }}
      >
        <CalendarDays size={22} />
      </div>

      <h3
        className="mt-4 text-lg font-semibold"
        style={{
          color: "var(--text-primary)",
        }}
      >
        {title}
      </h3>

      <p
        className="mx-auto mt-2 max-w-md text-sm"
        style={{
          color: "var(--text-muted)",
        }}
      >
        {description}
      </p>

      <button
        type="button"
        onClick={() => router.push("/jobs")}
        className="mt-6 rounded-xl px-4 py-2.5 text-sm font-medium transition hover:-translate-y-0.5"
        style={{
          background: "var(--accent)",
          color: "#ffffff",
        }}
      >
        Manage Jobs
      </button>
    </div>
  );
}