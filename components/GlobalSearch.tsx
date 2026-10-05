"use client";

import {
  BriefcaseBusiness,
  MapPin,
  Search,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { useJobs } from "@/context/JobContext";

export default function GlobalSearch() {
  const { jobs } = useJobs();

  const router = useRouter();

  const [query, setQuery] =
    useState("");

  const [focused, setFocused] =
    useState(false);

  const wrapperRef =
    useRef<HTMLDivElement>(null);

  /*
   * Search jobs
   */
  const results = useMemo(() => {
    const search =
      query.trim().toLowerCase();

    if (!search) {
      return [];
    }

    return jobs
      .filter((job) => {
        const searchableText = [
          job.company,
          job.position,
          job.location,
          job.recruiter,
          job.status,
          job.type,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(
          search
        );
      })
      .slice(0, 6);
  }, [jobs, query]);

  /*
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target as Node
        )
      ) {
        setFocused(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /*
   * Select a job
   */
  const handleSelect = (
    jobId: string
  ) => {
    setQuery("");
    setFocused(false);

    router.push(
      `/jobs?job=${encodeURIComponent(
        jobId
      )}`
    );
  };

  /*
   * Clear search
   */
  const handleClear = () => {
    setQuery("");
    setFocused(false);
  };

  /*
   * Keyboard handling
   */
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key === "Enter" &&
      results.length > 0
    ) {
      handleSelect(results[0].id);
      return;
    }

    if (event.key === "Escape") {
      setFocused(false);
    }
  };

  const showDropdown =
    focused && query.trim().length > 0;

  return (
    <div
      ref={wrapperRef}
      className="relative w-full max-w-[610px]"
    >
      {/* Search input */}
      <div
        className="flex h-12 items-center rounded-2xl border px-4 transition-all duration-200"
        style={{
          borderColor: focused
            ? "var(--accent)"
            : "var(--glass-border)",

          background:
            "var(--glass)",

          boxShadow: focused
            ? "0 0 0 3px var(--accent-soft)"
            : "none",
        }}
      >
        {/* Search icon */}
        <Search
          size={19}
          strokeWidth={1.8}
          className="shrink-0"
          style={{
            color:
              focused
                ? "var(--accent)"
                : "var(--text-muted)",
          }}
        />

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(event) =>
            setQuery(
              event.target.value
            )
          }
          onFocus={() =>
            setFocused(true)
          }
          onKeyDown={handleKeyDown}
          placeholder="Search jobs, companies..."
          aria-label="Search jobs and companies"
          className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
          style={{
            color:
              "var(--text-primary)",
          }}
        />

        {/* Clear */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition hover:bg-white/10"
            style={{
              color:
                "var(--text-muted)",
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Search dropdown */}
      {showDropdown && (
        <div
          className="absolute left-0 right-0 top-[calc(100%+10px)] z-[200] overflow-hidden rounded-2xl border"
          style={{
            background:
              "var(--background)",

            borderColor:
              "var(--glass-border)",

            boxShadow:
              "0 25px 70px rgba(0, 0, 0, 0.38)",

            backdropFilter:
              "blur(28px)",

            WebkitBackdropFilter:
              "blur(28px)",
          }}
        >
          {results.length === 0 ? (
            /* No results */
            <div className="px-5 py-6 text-center">
              <div
                className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  background:
                    "var(--accent-soft)",
                  color:
                    "var(--accent)",
                }}
              >
                <Search size={18} />
              </div>

              <p
                className="mt-3 text-sm font-medium"
                style={{
                  color:
                    "var(--text-primary)",
                }}
              >
                No jobs found
              </p>

              <p
                className="mt-1 text-xs"
                style={{
                  color:
                    "var(--text-secondary)",
                }}
              >
                Try another company,
                position, or location.
              </p>
            </div>
          ) : (
            <>
              {/* Results header */}
              <div
                className="flex items-center justify-between border-b px-4 py-3"
                style={{
                  borderColor:
                    "var(--glass-border)",
                }}
              >
                <span
                  className="text-[11px] font-medium uppercase tracking-wider"
                  style={{
                    color:
                      "var(--text-muted)",
                  }}
                >
                  Search results
                </span>

                <span
                  className="text-[11px]"
                  style={{
                    color:
                      "var(--text-muted)",
                  }}
                >
                  {results.length}{" "}
                  {results.length === 1
                    ? "result"
                    : "results"}
                </span>
              </div>

              {/* Results */}
              <div className="max-h-[360px] overflow-y-auto">
                {results.map(
                  (job) => (
                    <button
                      key={job.id}
                      type="button"
                      onClick={() =>
                        handleSelect(
                          job.id
                        )
                      }
                      className="flex w-full items-center gap-3 border-b px-4 py-3 text-left transition last:border-b-0 hover:bg-white/5"
                      style={{
                        borderColor:
                          "var(--glass-border)",
                      }}
                    >
                      {/* Icon */}
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                        style={{
                          background:
                            "var(--accent-soft)",
                          color:
                            "var(--accent)",
                        }}
                      >
                        <BriefcaseBusiness
                          size={18}
                          strokeWidth={
                            1.8
                          }
                        />
                      </div>

                      {/* Information */}
                      <div className="min-w-0 flex-1">
                        <p
                          className="truncate text-sm font-medium"
                          style={{
                            color:
                              "var(--text-primary)",
                          }}
                        >
                          {job.position}
                        </p>

                        <p
                          className="mt-0.5 truncate text-xs"
                          style={{
                            color:
                              "var(--text-secondary)",
                          }}
                        >
                          {job.company}
                        </p>

                        {job.location && (
                          <div
                            className="mt-1 flex items-center gap-1 text-[11px]"
                            style={{
                              color:
                                "var(--text-muted)",
                            }}
                          >
                            <MapPin
                              size={11}
                            />

                            <span className="truncate">
                              {
                                job.location
                              }
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Status */}
                      <span
                        className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium capitalize"
                        style={{
                          background:
                            "var(--accent-soft)",
                          color:
                            "var(--accent)",
                        }}
                      >
                        {job.status}
                      </span>
                    </button>
                  )
                )}
              </div>

              {/* View all */}
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setFocused(false);

                  router.push(
                    "/jobs"
                  );
                }}
                className="w-full border-t px-4 py-3 text-center text-xs font-medium transition hover:bg-white/5"
                style={{
                  borderColor:
                    "var(--glass-border)",

                  color:
                    "var(--accent)",
                }}
              >
                View all jobs
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}