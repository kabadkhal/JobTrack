"use client";

import { motion } from "framer-motion";
import {
  Bookmark,
  Send,
  SearchCheck,
  Video,
  Trophy,
} from "lucide-react";

import { useJobs } from "@/context/JobContext";

export default function ApplicationPipeline() {
  const { jobs } = useJobs();

  /*
   * Calculate the number of jobs
   * in each application stage.
   */
  const stageCounts = {
    saved: jobs.filter((job) => job.status === "saved").length,
    applied: jobs.filter((job) => job.status === "applied").length,
    screening: jobs.filter((job) => job.status === "screening").length,
    interview: jobs.filter((job) => job.status === "interview").length,
    offer: jobs.filter((job) => job.status === "offer").length,
  };

  /*
   * Total jobs currently in the tracker.
   */
  const totalJobs = jobs.length;

  const stages = [
    {
      title: "Saved",
      count: stageCounts.saved,
      icon: Bookmark,
      color: "#8b5cf6",
    },
    {
      title: "Applied",
      count: stageCounts.applied,
      icon: Send,
      color: "#3b82f6",
    },
    {
      title: "Screening",
      count: stageCounts.screening,
      icon: SearchCheck,
      color: "#f59e0b",
    },
    {
      title: "Interview",
      count: stageCounts.interview,
      icon: Video,
      color: "#ec4899",
    },
    {
      title: "Offer",
      count: stageCounts.offer,
      icon: Trophy,
      color: "#10b981",
    },
  ];

  return (
    <section className="mt-8">
      {/* Section Header */}
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p
            className="text-sm"
            style={{
              color: "var(--text-muted)",
            }}
          >
            Overview
          </p>

          <h3
            className="mt-1 text-xl font-semibold"
            style={{
              color: "var(--text-primary)",
            }}
          >
            Application Pipeline
          </h3>
        </div>

        <span
          className="text-xs"
          style={{
            color: "var(--text-muted)",
          }}
        >
          {totalJobs} total
        </span>
      </div>

      {/* Pipeline Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stages.map((stage, index) => {
          const Icon = stage.icon;

          /*
           * Calculate percentage.
           *
           * If there are no jobs yet,
           * avoid dividing by zero.
           */
          const percentage =
            totalJobs > 0 ? (stage.count / totalJobs) * 100 : 0;

          return (
            <motion.div
              key={stage.title}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
              }}
              whileHover={{
                y: -4,
              }}
              className="glass rounded-3xl p-5"
            >
              {/* Icon */}
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  background: `${stage.color}18`,
                  color: stage.color,
                }}
              >
                <Icon size={18} strokeWidth={1.8} />
              </div>

              {/* Stage Name */}
              <p
                className="mt-5 text-sm"
                style={{
                  color: "var(--text-secondary)",
                }}
              >
                {stage.title}
              </p>

              {/* Count + Percentage */}
              <div className="mt-2 flex items-end justify-between">
                <span
                  className="text-2xl font-semibold"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  {stage.count}
                </span>

                <span
                  className="text-xs"
                  style={{
                    color: "var(--text-muted)",
                  }}
                >
                  {Math.round(percentage)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div
                className="mt-4 h-1.5 overflow-hidden rounded-full"
                style={{
                  background: "var(--glass-hover)",
                }}
              >
                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: `${percentage}%`,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.3 + index * 0.08,
                    ease: "easeOut",
                  }}
                  className="h-full rounded-full"
                  style={{
                    background: stage.color,
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}