"use client";

import { useState } from "react";
import {
  X,
  Plus,
  BriefcaseBusiness,
} from "lucide-react";

import { useJobs } from "@/context/JobContext";
import { useToast } from "@/components/ToastProvider";
import type {
  Job,
  JobStatus,
  JobType,
} from "@/types/job";

interface AddJobModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddJobModal({
  open,
  onClose,
}: AddJobModalProps) {
  const { addJob } = useJobs();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    company: "",
    position: "",
    location: "",
    type: "full-time" as JobType,
    status: "saved" as JobStatus,
    appliedDate:
      new Date().toISOString().split("T")[0],
    salary: "",
    jobUrl: "",
    recruiter: "",
    recruiterEmail: "",
    interviewDate: "",
    notes: "",
  });

  if (!open) return null;

  const handleChange = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (
      !form.company.trim() ||
      !form.position.trim()
    ) {
      showToast(
        "Company and position are required.",
        "error"
      );
      return;
    }

    if (
      form.jobUrl.trim() &&
      !/^https?:\/\/.+/i.test(
        form.jobUrl.trim()
      )
    ) {
      showToast(
        "Job URL must start with http:// or https://.",
        "error"
      );
      return;
    }

    if (
      form.recruiterEmail.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.recruiterEmail.trim()
      )
    ) {
      showToast(
        "Please enter a valid recruiter email.",
        "error"
      );
      return;
    }

    if (
      form.status === "interview" &&
      !form.interviewDate
    ) {
      showToast(
        "Please add an interview date and time.",
        "error"
      );
      return;
    }

    const newJob: Job = {
      id: crypto.randomUUID(),
      company: form.company.trim(),
      position: form.position.trim(),
      location:
        form.location.trim() ||
        "Not specified",
      type: form.type,
      status: form.status,
      appliedDate: form.appliedDate,
      salary:
        form.salary.trim() || undefined,
      jobUrl:
        form.jobUrl.trim() || undefined,
      recruiter:
        form.recruiter.trim() || undefined,
      recruiterEmail:
        form.recruiterEmail.trim() ||
        undefined,
      interviewDate:
        form.interviewDate || undefined,
      notes:
        form.notes.trim() || undefined,
    };

    try {
      await addJob(newJob);

      showToast(
        "Job added successfully",
        "success"
      );
    } catch (error) {
      console.error(
        "Failed to add job:",
        error
      );

      showToast(
        error instanceof Error
          ? error.message
          : "Unable to add job. Please try again.",
        "error"
      );

      return;
    }

    setForm({
      company: "",
      position: "",
      location: "",
      type: "full-time",
      status: "saved",
      appliedDate:
        new Date().toISOString().split("T")[0],
      salary: "",
      jobUrl: "",
      recruiter: "",
      recruiterEmail: "",
      interviewDate: "",
      notes: "",
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{
        background: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(10px)",
      }}
      onClick={onClose}
    >
      <div
        className="glass max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{
                background:
                  "var(--accent-soft)",
                color: "var(--accent)",
              }}
            >
              <BriefcaseBusiness
                size={20}
                strokeWidth={1.8}
              />
            </div>

            <div>
              <h2
                className="text-xl font-semibold"
                style={{
                  color:
                    "var(--text-primary)",
                }}
              >
                Add Job
              </h2>

              <p
                className="text-sm"
                style={{
                  color: "var(--text-muted)",
                }}
              >
                Add a new opportunity to your
                job tracker.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 transition hover:scale-105"
            style={{
              color: "var(--text-muted)",
            }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >
          {/* Company + Position */}
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Company"
              required
              value={form.company}
              placeholder="e.g. Amazon"
              onChange={(value) =>
                handleChange(
                  "company",
                  value
                )
              }
            />

            <FormField
              label="Position"
              required
              value={form.position}
              placeholder="e.g. DevOps Engineer"
              onChange={(value) =>
                handleChange(
                  "position",
                  value
                )
              }
            />
          </div>

          {/* Location + Type */}
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Location"
              value={form.location}
              placeholder="e.g. Bangalore"
              onChange={(value) =>
                handleChange(
                  "location",
                  value
                )
              }
            />

            <SelectField
              label="Job Type"
              value={form.type}
              onChange={(value) =>
                handleChange(
                  "type",
                  value
                )
              }
              options={[
                [
                  "full-time",
                  "Full-time",
                ],
                [
                  "part-time",
                  "Part-time",
                ],
                [
                  "internship",
                  "Internship",
                ],
                [
                  "contract",
                  "Contract",
                ],
              ]}
            />
          </div>

          {/* Status + Applied Date */}
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Status"
              value={form.status}
              onChange={(value) =>
                handleChange(
                  "status",
                  value
                )
              }
              options={[
                ["saved", "Saved"],
                ["applied", "Applied"],
                [
                  "screening",
                  "Screening",
                ],
                [
                  "interview",
                  "Interview",
                ],
                ["offer", "Offer"],
                [
                  "rejected",
                  "Rejected",
                ],
                [
                  "withdrawn",
                  "Withdrawn",
                ],
              ]}
            />

            <FormField
              label="Date"
              type="date"
              value={form.appliedDate}
              onChange={(value) =>
                handleChange(
                  "appliedDate",
                  value
                )
              }
            />
          </div>

          {/* Salary + URL */}
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Salary"
              value={form.salary}
              placeholder="e.g. ₹8–12 LPA"
              onChange={(value) =>
                handleChange(
                  "salary",
                  value
                )
              }
            />

            <FormField
              label="Job URL"
              type="url"
              value={form.jobUrl}
              placeholder="https://..."
              onChange={(value) =>
                handleChange(
                  "jobUrl",
                  value
                )
              }
            />
          </div>

          {/* Recruiter */}
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Recruiter"
              value={form.recruiter}
              placeholder="Recruiter name"
              onChange={(value) =>
                handleChange(
                  "recruiter",
                  value
                )
              }
            />

            <FormField
              label="Recruiter Email"
              type="email"
              value={
                form.recruiterEmail
              }
              placeholder="recruiter@company.com"
              onChange={(value) =>
                handleChange(
                  "recruiterEmail",
                  value
                )
              }
            />
          </div>

          {/* Interview */}
          <FormField
            label="Interview Date"
            type="datetime-local"
            value={form.interviewDate}
            onChange={(value) =>
              handleChange(
                "interviewDate",
                value
              )
            }
          />

          {/* Notes */}
          <div>
            <label
              className="mb-2 block text-sm"
              style={{
                color:
                  "var(--text-secondary)",
              }}
            >
              Notes
            </label>

            <textarea
              value={form.notes}
              onChange={(event) =>
                handleChange(
                  "notes",
                  event.target.value
                )
              }
              placeholder="Add notes about this opportunity..."
              rows={4}
              className="w-full resize-none rounded-2xl border px-4 py-3 text-sm outline-none transition"
              style={{
                color:
                  "var(--text-primary)",
                background:
                  "var(--glass)",
                borderColor:
                  "var(--glass-border)",
              }}
            />
          </div>

          {/* Actions */}
          <div
            className="flex justify-end gap-3 border-t pt-5"
            style={{
              borderColor:
                "var(--glass-border)",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-5 py-2.5 text-sm transition hover:opacity-70"
              style={{
                color:
                  "var(--text-secondary)",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition hover:scale-[1.02]"
              style={{
                color: "#fff",
                background:
                  "var(--accent)",
              }}
            >
              <Plus size={17} />
              Add Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- Reusable form components ---------- */

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        className="mb-2 block text-sm"
        style={{
          color:
            "var(--text-secondary)",
        }}
      >
        {label}

        {required && (
          <span
            className="ml-1"
            style={{
              color: "var(--danger)",
            }}
          >
            *
          </span>
        )}
      </label>

      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition"
        style={{
          color:
            "var(--text-primary)",
          background:
            "var(--glass)",
          borderColor:
            "var(--glass-border)",
        }}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <div>
      <label
        className="mb-2 block text-sm"
        style={{
          color:
            "var(--text-secondary)",
        }}
      >
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
        style={{
          color:
            "var(--text-primary)",
          background:
            "var(--background)",
          borderColor:
            "var(--glass-border)",
        }}
      >
        {options.map(
          ([
            optionValue,
            optionLabel,
          ]) => (
            <option
              key={optionValue}
              value={optionValue}
            >
              {optionLabel}
            </option>
          )
        )}
      </select>
    </div>
  );
}