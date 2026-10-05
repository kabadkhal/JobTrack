"use client";

import {
  Bell,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  X,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { useJobs } from "@/context/JobContext";
import type { Job } from "@/types/job";

interface Notification {
  id: string;
  title: string;
  description: string;
  type:
    | "interview"
    | "offer"
    | "application"
    | "rejected";
  jobId?: string;
  date?: Date;
}

/* ---------------- Date Helpers ---------------- */

function getDateOnly(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

function isToday(date: Date) {
  return (
    getDateOnly(new Date()).getTime() ===
    getDateOnly(date).getTime()
  );
}

function isTomorrow(date: Date) {
  const tomorrow = getDateOnly(new Date());

  tomorrow.setDate(
    tomorrow.getDate() + 1
  );

  return (
    tomorrow.getTime() ===
    getDateOnly(date).getTime()
  );
}

function formatInterviewDate(date: Date) {
  return date.toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/* ---------------- Notification Generator ---------------- */

function createNotifications(
  jobs: Job[]
): Notification[] {
  const notifications: Notification[] = [];

  jobs.forEach((job) => {
    /* ---------------- Interviews ---------------- */

    if (
      job.status === "interview" &&
      job.interviewDate
    ) {
      const interviewDate =
        new Date(job.interviewDate);

      if (
        !Number.isNaN(
          interviewDate.getTime()
        )
      ) {
        const now = new Date();

        if (interviewDate >= now) {
          if (isToday(interviewDate)) {
            notifications.push({
              id: `interview-today-${job.id}`,
              title: "Interview today",
              description: `${job.position} at ${job.company} — ${formatInterviewDate(
                interviewDate
              )}`,
              type: "interview",
              jobId: job.id,
              date: interviewDate,
            });
          } else if (
            isTomorrow(interviewDate)
          ) {
            notifications.push({
              id: `interview-tomorrow-${job.id}`,
              title: "Interview tomorrow",
              description: `${job.position} at ${job.company} — ${formatInterviewDate(
                interviewDate
              )}`,
              type: "interview",
              jobId: job.id,
              date: interviewDate,
            });
          } else {
            notifications.push({
              id: `interview-upcoming-${job.id}`,
              title: "Upcoming interview",
              description: `${job.position} at ${job.company} — ${formatInterviewDate(
                interviewDate
              )}`,
              type: "interview",
              jobId: job.id,
              date: interviewDate,
            });
          }
        }
      }
    }

    /* ---------------- Offer ---------------- */

    if (job.status === "offer") {
      notifications.push({
        id: `offer-${job.id}`,
        title: "Offer received",
        description: `${job.position} at ${job.company} is marked as an offer.`,
        type: "offer",
        jobId: job.id,
        date: new Date(job.appliedDate),
      });
    }

    /* ---------------- Application ---------------- */

    if (job.status === "applied") {
      const appliedDate =
        new Date(job.appliedDate);

      const days =
        (Date.now() -
          appliedDate.getTime()) /
        (1000 * 60 * 60 * 24);

      if (days <= 3) {
        notifications.push({
          id: `application-${job.id}`,
          title: "Application submitted",
          description: `${job.position} at ${job.company}`,
          type: "application",
          jobId: job.id,
          date: appliedDate,
        });
      }
    }

    /* ---------------- Rejected ---------------- */

    if (job.status === "rejected") {
      notifications.push({
        id: `rejected-${job.id}`,
        title: "Application update",
        description: `${job.position} at ${job.company} was marked as rejected.`,
        type: "rejected",
        jobId: job.id,
        date: new Date(job.appliedDate),
      });
    }
  });

  return notifications
    .sort((a, b) => {
      /*
       * Interviews always get priority.
       */
      if (
        a.type === "interview" &&
        b.type !== "interview"
      ) {
        return -1;
      }

      if (
        a.type !== "interview" &&
        b.type === "interview"
      ) {
        return 1;
      }

      return (
        (b.date?.getTime() || 0) -
        (a.date?.getTime() || 0)
      );
    })
    .slice(0, 10);
}

/* ---------------- Notification Icon ---------------- */

function NotificationIcon({
  type,
}: {
  type: Notification["type"];
}) {
  if (type === "interview") {
    return <Calendar size={17} />;
  }

  if (type === "offer") {
    return <CheckCircle2 size={17} />;
  }

  if (type === "rejected") {
    return <X size={17} />;
  }

  return <Briefcase size={17} />;
}

/* ---------------- Main Component ---------------- */

export default function NotificationBell() {
  const router = useRouter();

  const { jobs } = useJobs();

  const [open, setOpen] =
    useState(false);

  const wrapperRef =
    useRef<HTMLDivElement>(null);

  const notifications = useMemo(
    () => createNotifications(jobs),
    [jobs]
  );

  /* ---------------- Outside Click ---------------- */

  useEffect(() => {
    const handleOutside = (
      event: MouseEvent
    ) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener(
        "mousedown",
        handleOutside
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutside
      );
    };
  }, [open]);

  /* ---------------- Escape ---------------- */

  useEffect(() => {
    if (!open) return;

    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [open]);

  /* ---------------- Lock Body ---------------- */

  useEffect(() => {
    if (!open) return;

    const previous =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previous;
    };
  }, [open]);

  /* ---------------- Open Specific Job ---------------- */

  function openJob(jobId?: string) {
    setOpen(false);

    if (!jobId) {
      router.push("/jobs");
      return;
    }

    router.push(
      `/jobs?job=${encodeURIComponent(jobId)}`
    );
  }

  return (
    <div
      ref={wrapperRef}
      className="relative shrink-0"
    >
      {/* Bell Button */}

      <button
        type="button"
        onClick={() =>
          setOpen((current) => !current)
        }
        aria-label="Notifications"
        aria-expanded={open}
        className="
          relative
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          border
          border-white/10
          bg-white/5
          transition
          hover:bg-white/10
        "
        style={{
          color: "var(--text-secondary)",
        }}
      >
        <Bell
          size={19}
          strokeWidth={1.8}
        />

        {notifications.length > 0 && (
          <span
            className="
              absolute
              right-2
              top-2
              h-2.5
              w-2.5
              rounded-full
              border-2
            "
            style={{
              background:
                "var(--accent)",
              borderColor:
                "var(--background)",
            }}
          />
        )}
      </button>

      {/* Backdrop */}

      <AnimatePresence>
        {open && (
          <motion.button
            type="button"
            aria-label="Close notifications"
            onClick={() => setOpen(false)}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="
              fixed
              inset-0
              z-[80]
              bg-black/55
              backdrop-blur-md
            "
          />
        )}
      </AnimatePresence>

      {/* Notification Panel */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -10,
              scale: 0.97,
            }}
            transition={{
              duration: 0.18,
            }}
            className="
              glass
              fixed
              left-3
              right-3
              top-[76px]
              z-[90]
              overflow-hidden
              rounded-2xl
              sm:left-auto
              sm:right-4
              sm:top-[88px]
              sm:w-[360px]
            "
            style={{
              boxShadow:
                "0 28px 80px rgba(0,0,0,0.55)",
              border:
                "1px solid var(--glass-border)",
            }}
          >
            {/* Header */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                px-4
                py-4
              "
              style={{
                borderColor:
                  "var(--glass-border)",
              }}
            >
              <div>
                <h3
                  className="text-sm font-semibold"
                  style={{
                    color:
                      "var(--text-primary)",
                  }}
                >
                  Notifications
                </h3>

                <p
                  className="
                    mt-0.5
                    text-xs
                  "
                  style={{
                    color:
                      "var(--text-muted)",
                  }}
                >
                  Your latest JobTrack updates
                </p>
              </div>

              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <span
                    className="
                      rounded-full
                      px-2.5
                      py-1
                      text-xs
                    "
                    style={{
                      background:
                        "var(--accent-soft)",
                      color:
                        "var(--accent)",
                    }}
                  >
                    {notifications.length}
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    hover:bg-white/10
                  "
                  style={{
                    color:
                      "var(--text-secondary)",
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Empty State */}

            {notifications.length === 0 ? (
              <div
                className="
                  px-6
                  py-10
                  text-center
                "
              >
                <div
                  className="
                    mx-auto
                    mb-3
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                  "
                  style={{
                    background:
                      "var(--accent-soft)",
                    color:
                      "var(--accent)",
                  }}
                >
                  <Bell size={21} />
                </div>

                <h4
                  className="text-sm font-medium"
                  style={{
                    color:
                      "var(--text-primary)",
                  }}
                >
                  You're all caught up
                </h4>

                <p
                  className="
                    mt-1
                    text-xs
                  "
                  style={{
                    color:
                      "var(--text-secondary)",
                  }}
                >
                  New interviews and
                  application updates
                  will appear here.
                </p>
              </div>
            ) : (
              /* Notification List */

              <div
                className="
                  max-h-[420px]
                  overflow-y-auto
                "
              >
                {notifications.map(
                  (notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() =>
                        openJob(
                          notification.jobId
                        )
                      }
                      className="
                        flex
                        w-full
                        gap-3
                        border-b
                        p-4
                        text-left
                        last:border-b-0
                        hover:bg-white/5
                      "
                      style={{
                        borderColor:
                          "var(--glass-border)",
                      }}
                    >
                      {/* Icon */}

                      <div
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                        "
                        style={{
                          background:
                            "var(--accent-soft)",
                          color:
                            "var(--accent)",
                        }}
                      >
                        <NotificationIcon
                          type={
                            notification.type
                          }
                        />
                      </div>

                      {/* Content */}

                      <div className="min-w-0 flex-1">
                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-2
                          "
                        >
                          <p
                            className="
                              text-sm
                              font-medium
                            "
                            style={{
                              color:
                                "var(--text-primary)",
                            }}
                          >
                            {
                              notification.title
                            }
                          </p>

                          <ChevronRight
                            size={15}
                            className="shrink-0"
                            style={{
                              color:
                                "var(--text-muted)",
                            }}
                          />
                        </div>

                        <p
                          className="
                            mt-1
                            text-xs
                            leading-5
                          "
                          style={{
                            color:
                              "var(--text-secondary)",
                          }}
                        >
                          {
                            notification.description
                          }
                        </p>

                        {notification.type ===
                          "interview" && (
                          <div
                            className="
                              mt-2
                              flex
                              items-center
                              gap-1
                              text-[11px]
                            "
                            style={{
                              color:
                                "var(--accent)",
                            }}
                          >
                            <Clock size={12} />
                            Interview scheduled
                          </div>
                        )}
                      </div>
                    </button>
                  )
                )}
              </div>
            )}

            {/* Footer */}

            <div
              className="
                border-t
                px-4
                py-3
              "
              style={{
                borderColor:
                  "var(--glass-border)",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  router.push("/jobs");
                }}
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  py-2.5
                  text-xs
                  font-medium
                  hover:bg-white/5
                "
                style={{
                  color:
                    "var(--text-secondary)",
                }}
              >
                View all applications
                <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}