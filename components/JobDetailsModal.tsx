"use client";

import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Mail,
  MapPin,
  Pencil,
  Save,
  X,
} from "lucide-react";

import { useJobs } from "@/context/JobContext";
import { useToast } from "@/components/ToastProvider";
import type {
  Job,
  JobStatus,
  JobType,
} from "@/types/job";

interface JobDetailsModalProps {
  job: Job | null;
  onClose: () => void;
}

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

export default function JobDetailsModal({
  job,
  onClose,
}: JobDetailsModalProps) {
  const { updateJob } = useJobs();
  const { showToast } = useToast();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    company: "",
    position: "",
    location: "",
    type: "full-time" as JobType,
    status: "saved" as JobStatus,
    appliedDate: "",
    salary: "",
    jobUrl: "",
    recruiter: "",
    recruiterEmail: "",
    interviewDate: "",
    notes: "",
  });

  useEffect(() => {
    if (!job) return;

    setForm({
      company: job.company,
      position: job.position,
      location: job.location,
      type: job.type,
      status: job.status,
      appliedDate: job.appliedDate,
      salary: job.salary ?? "",
      jobUrl: job.jobUrl ?? "",
      recruiter: job.recruiter ?? "",
      recruiterEmail: job.recruiterEmail ?? "",
      interviewDate: job.interviewDate ?? "",
      notes: job.notes ?? "",
    });

    setEditing(false);
    setSaving(false);
    setError("");
  }, [job]);

  if (!job) return null;

  const status = statusConfig[job.status];

  const handleChange = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const startEditing = () => {
    setError("");
    setEditing(true);
  };

  const cancelEditing = () => {
    setForm({
      company: job.company,
      position: job.position,
      location: job.location,
      type: job.type,
      status: job.status,
      appliedDate: job.appliedDate,
      salary: job.salary ?? "",
      jobUrl: job.jobUrl ?? "",
      recruiter: job.recruiter ?? "",
      recruiterEmail: job.recruiterEmail ?? "",
      interviewDate: job.interviewDate ?? "",
      notes: job.notes ?? "",
    });

    setError("");
    setEditing(false);
  };

  const handleSave = async () => {
    const company = form.company.trim();
    const position = form.position.trim();

    if (!company) {
      setError("Company name is required.");
      return;
    }

    if (!position) {
      setError("Position is required.");
      return;
    }

    if (
      form.jobUrl.trim() &&
      !/^https?:\/\/.+/i.test(
        form.jobUrl.trim()
      )
    ) {
      setError(
        "Job URL must start with http:// or https://."
      );
      return;
    }

    if (
      form.recruiterEmail.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.recruiterEmail.trim()
      )
    ) {
      setError("Please enter a valid recruiter email.");
      return;
    }

    if (
      form.status === "interview" &&
      !form.interviewDate
    ) {
      setError(
        "Please add an interview date and time before setting the status to Interview."
      );
      return;
    }

    setSaving(true);
    setError("");

    try {
      await updateJob(job.id, {
        company,
        position,
        location:
          form.location.trim() || "Not specified",
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
          form.recruiterEmail.trim() || undefined,
        interviewDate:
          form.interviewDate || undefined,
        notes:
          form.notes.trim() || undefined,
      });

      setEditing(false);

      showToast(
        "Job updated successfully",
        "success"
      );
    } catch (saveError) {
      console.error(
        "Failed to update job:",
        saveError
      );

      const message =
        saveError instanceof Error
          ? saveError.message
          : "Unable to save changes. Please try again.";

      setError(message);

      showToast(message, "error");
    } finally {
      setSaving(false);
    }
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
        className="glass max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-5 sm:p-6"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
              style={{
                background: "var(--accent-soft)",
                color: "var(--accent)",
              }}
            >
              <BriefcaseBusiness
                size={21}
                strokeWidth={1.8}
              />
            </div>

            <div className="min-w-0">
              <h2
                className="text-xl font-semibold"
                style={{
                  color: "var(--text-primary)",
                }}
              >
                {editing
                  ? "Edit Job"
                  : job.position}
              </h2>

              <p
                className="mt-1 truncate text-sm"
                style={{
                  color: "var(--text-secondary)",
                }}
              >
                {editing
                  ? "Update your job information."
                  : job.company}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={saving}
            className="shrink-0 rounded-xl p-2 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              color: "var(--text-muted)",
            }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {!editing ? (
          <>
            {/* Status */}
            <div
              className="mt-6 rounded-2xl border p-4"
              style={{
                borderColor:
                  "var(--glass-border)",
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p
                    className="text-xs"
                    style={{
                      color: "var(--text-muted)",
                    }}
                  >
                    Current status
                  </p>

                  <span
                    className="mt-2 inline-flex rounded-full px-3 py-1.5 text-xs font-medium"
                    style={{
                      color: status.color,
                      background:
                        status.background,
                    }}
                  >
                    {status.label}
                  </span>
                </div>

                <button
                  onClick={startEditing}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition hover:scale-[1.02]"
                  style={{
                    color: "var(--accent)",
                    background:
                      "var(--accent-soft)",
                  }}
                >
                  <Pencil size={15} />
                  Edit
                </button>
              </div>
            </div>

            {/* Information */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <InfoItem
                icon={<MapPin size={16} />}
                label="Location"
                value={job.location}
              />

              <InfoItem
                icon={
                  <BriefcaseBusiness size={16} />
                }
                label="Job type"
                value={formatJobType(job.type)}
              />

              <InfoItem
                icon={<CalendarDays size={16} />}
                label="Applied"
                value={job.appliedDate}
              />

              {job.interviewDate && (
                <InfoItem
                  icon={<CalendarDays size={16} />}
                  label="Interview"
                  value={job.interviewDate}
                />
              )}

              {job.salary && (
                <InfoItem
                  icon={
                    <BriefcaseBusiness size={16} />
                  }
                  label="Salary"
                  value={job.salary}
                />
              )}

              {job.recruiter && (
                <InfoItem
                  icon={
                    <BriefcaseBusiness size={16} />
                  }
                  label="Recruiter"
                  value={job.recruiter}
                />
              )}

              {job.recruiterEmail && (
                <InfoItem
                  icon={<Mail size={16} />}
                  label="Recruiter email"
                  value={job.recruiterEmail}
                />
              )}
            </div>

            {/* Notes */}
            {job.notes && (
              <div className="mt-6">
                <p
                  className="text-xs"
                  style={{
                    color: "var(--text-muted)",
                  }}
                >
                  Notes
                </p>

                <p
                  className="mt-2 rounded-2xl border p-4 text-sm leading-6"
                  style={{
                    color:
                      "var(--text-secondary)",
                    borderColor:
                      "var(--glass-border)",
                  }}
                >
                  {job.notes}
                </p>
              </div>
            )}

            {/* Footer */}
            <div
              className="mt-6 flex flex-wrap justify-end gap-3 border-t pt-5"
              style={{
                borderColor:
                  "var(--glass-border)",
              }}
            >
              {job.jobUrl && (
                <a
                  href={job.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm transition hover:scale-[1.02]"
                  style={{
                    color:
                      "var(--text-secondary)",
                    background:
                      "var(--glass-hover)",
                  }}
                >
                  <ExternalLink size={15} />
                  Open Job
                </a>
              )}

              <button
                onClick={onClose}
                className="rounded-xl px-4 py-2.5 text-sm"
                style={{
                  color:
                    "var(--text-secondary)",
                  background:
                    "var(--glass-hover)",
                }}
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Edit form */}
            <div className="mt-6 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Company"
                  required
                  value={form.company}
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
                  onChange={(value) =>
                    handleChange(
                      "position",
                      value
                    )
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Location"
                  value={form.location}
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
                  label="Applied Date"
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

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Recruiter"
                  value={form.recruiter}
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
                  onChange={(value) =>
                    handleChange(
                      "recruiterEmail",
                      value
                    )
                  }
                />
              </div>

              <FormField
                label={
                  form.status === "interview"
                    ? "Interview Date & Time *"
                    : "Interview Date & Time"
                }
                type="datetime-local"
                value={form.interviewDate}
                required={
                  form.status === "interview"
                }
                onChange={(value) =>
                  handleChange(
                    "interviewDate",
                    value
                  )
                }
              />

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
                  rows={4}
                  placeholder="Add notes..."
                  className="w-full resize-none rounded-2xl border px-4 py-3 text-sm outline-none"
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

              {/* Error */}
              {error && (
                <div
                  className="rounded-2xl border px-4 py-3 text-sm"
                  style={{
                    color: "var(--danger)",
                    background:
                      "rgba(251, 113, 133, 0.08)",
                    borderColor:
                      "rgba(251, 113, 133, 0.2)",
                  }}
                >
                  {error}
                </div>
              )}
            </div>

            {/* Edit actions */}
            <div
              className="mt-6 flex flex-wrap justify-end gap-3 border-t pt-5"
              style={{
                borderColor:
                  "var(--glass-border)",
              }}
            >
              <button
                onClick={cancelEditing}
                disabled={saving}
                className="rounded-xl px-4 py-2.5 text-sm transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  color:
                    "var(--text-secondary)",
                  background:
                    "var(--glass-hover)",
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="flex min-w-[130px] items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  color: "#fff",
                  background:
                    "var(--accent)",
                }}
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- Form Field ---------------- */

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
          color: "var(--text-secondary)",
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
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition"
        style={{
          color: "var(--text-primary)",
          background: "var(--glass)",
          borderColor:
            "var(--glass-border)",
        }}
      />
    </div>
  );
}

/* ---------------- Select Field ---------------- */

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
          color: "var(--text-secondary)",
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
          color: "var(--text-primary)",
          background: "var(--background)",
          borderColor:
            "var(--glass-border)",
        }}
      >
        {options.map(
          ([optionValue, optionLabel]) => (
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

/* ---------------- Info Item ---------------- */

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{
        borderColor:
          "var(--glass-border)",
      }}
    >
      <div
        className="flex items-center gap-2 text-xs"
        style={{
          color: "var(--text-muted)",
        }}
      >
        {icon}
        {label}
      </div>

      <p
        className="mt-2 text-sm"
        style={{
          color: "var(--text-primary)",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function formatJobType(type: JobType) {
  switch (type) {
    case "full-time":
      return "Full-time";
    case "part-time":
      return "Part-time";
    case "internship":
      return "Internship";
    case "contract":
      return "Contract";
    default:
      return type;
  }
}