export type JobStatus =
  | "saved"
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "rejected"
  | "withdrawn";

export type JobType =
  | "full-time"
  | "part-time"
  | "internship"
  | "contract";

export interface Job {
  id: string;

  company: string;
  position: string;

  location: string;

  type: JobType;

  status: JobStatus;

  appliedDate: string;

  salary?: string;

  jobUrl?: string;

  recruiter?: string;

  recruiterEmail?: string;

  interviewDate?: string;

  notes?: string;
}