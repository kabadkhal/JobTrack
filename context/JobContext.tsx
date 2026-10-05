"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useSession } from "next-auth/react";

import type { Job } from "@/types/job";

interface JobContextType {
  jobs: Job[];
  isLoading: boolean;
  error: string | null;

  addJob: (job: Job) => Promise<void>;
  updateJob: (
    id: string,
    updates: Partial<Job>
  ) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
}

const JobContext = createContext<JobContextType | undefined>(
  undefined
);

export function JobProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { data: session, status } = useSession();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /*
   * Load jobs from MongoDB whenever the authenticated
   * user changes.
   */
  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true);
      return;
    }

    if (!session?.user?.id) {
      setJobs([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    async function loadJobs() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/jobs", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          const data = await response.json().catch(() => null);

          throw new Error(
            data?.message || "Failed to load jobs."
          );
        }

        const data = await response.json();

        setJobs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load jobs:", error);

        setJobs([]);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load jobs."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadJobs();
  }, [session?.user?.id, status]);

  /*
   * Create a job in MongoDB.
   */
  const addJob = async (job: Job) => {
    const response = await fetch("/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);

      throw new Error(
        data?.message || "Failed to create job."
      );
    }

    const createdJob = await response.json();

    setJobs((currentJobs) => [
      createdJob,
      ...currentJobs,
    ]);
  };

  /*
   * Update a job in MongoDB.
   */
  const updateJob = async (
    id: string,
    updates: Partial<Job>
  ) => {
    const response = await fetch(`/api/jobs/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);

      throw new Error(
        data?.message || "Failed to update job."
      );
    }

    const updatedJob = await response.json();

    setJobs((currentJobs) =>
      currentJobs.map((job) =>
        job.id === id ? updatedJob : job
      )
    );
  };

  /*
   * Delete a job from MongoDB.
   */
  const deleteJob = async (id: string) => {
    const response = await fetch(`/api/jobs/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);

      throw new Error(
        data?.message || "Failed to delete job."
      );
    }

    setJobs((currentJobs) =>
      currentJobs.filter((job) => job.id !== id)
    );
  };

  const value = useMemo(
    () => ({
      jobs,
      isLoading,
      error,
      addJob,
      updateJob,
      deleteJob,
    }),
    [jobs, isLoading, error]
  );

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobContext);

  if (!context) {
    throw new Error(
      "useJobs must be used inside JobProvider"
    );
  }

  return context;
}