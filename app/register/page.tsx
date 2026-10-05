"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to create your account."
        );
        return;
      }

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch {
      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10"
      style={{
        background: "var(--background)",
        color: "var(--text-primary)",
      }}
    >
      {/* Background glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-[-180px] h-[420px] w-[420px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--accent-soft), transparent 70%)",
        }}
      />

      <div
        className="pointer-events-none absolute bottom-[-180px] right-[-100px] h-[350px] w-[350px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--accent-soft), transparent 70%)",
        }}
      />

      {/* Register card */}
      <section className="glass relative z-10 w-full max-w-md rounded-3xl p-6 shadow-2xl sm:p-8">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{
              background: "var(--accent-soft)",
              color: "var(--accent)",
            }}
          >
            <BriefcaseBusiness size={27} />
          </div>

          <h1 className="text-2xl font-bold tracking-tight">
            Create your JobTrack account
          </h1>

          <p
            className="mt-2 text-sm"
            style={{
              color: "var(--text-secondary)",
            }}
          >
            Start organizing your job search in one place.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-5 rounded-xl border px-4 py-3 text-sm"
            style={{
              borderColor:
                "rgba(239, 68, 68, 0.3)",
              background:
                "rgba(239, 68, 68, 0.08)",
              color: "#ef4444",
            }}
          >
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div
            className="mb-5 flex items-start gap-2 rounded-xl border px-4 py-3 text-sm"
            style={{
              borderColor:
                "rgba(34, 197, 94, 0.3)",
              background:
                "rgba(34, 197, 94, 0.08)",
              color: "#22c55e",
            }}
          >
            <CheckCircle2
              size={17}
              className="mt-0.5 shrink-0"
            />
            <span>{success}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium"
            >
              Full name
            </label>

            <div className="relative">
              <User
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{
                  color: "var(--text-muted)",
                }}
              />

              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                className="h-12 w-full rounded-xl border pl-10 pr-4 text-sm outline-none transition"
                style={{
                  color: "var(--text-primary)",
                  background: "var(--glass)",
                  borderColor:
                    "var(--glass-border)",
                }}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              Email address
            </label>

            <div className="relative">
              <Mail
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{
                  color: "var(--text-muted)",
                }}
              />

              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                className="h-12 w-full rounded-xl border pl-10 pr-4 text-sm outline-none transition"
                style={{
                  color: "var(--text-primary)",
                  background: "var(--glass)",
                  borderColor:
                    "var(--glass-border)",
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>

            <div className="relative">
              <LockKeyhole
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{
                  color: "var(--text-muted)",
                }}
              />

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                className="h-12 w-full rounded-xl border pl-10 pr-11 text-sm outline-none transition"
                style={{
                  color: "var(--text-primary)",
                  background: "var(--glass)",
                  borderColor:
                    "var(--glass-border)",
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{
                  color: "var(--text-muted)",
                }}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium"
            >
              Confirm password
            </label>

            <div className="relative">
              <LockKeyhole
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{
                  color: "var(--text-muted)",
                }}
              />

              <input
                id="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                autoComplete="new-password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                className="h-12 w-full rounded-xl border pl-10 pr-11 text-sm outline-none transition"
                style={{
                  color: "var(--text-primary)",
                  background: "var(--glass)",
                  borderColor:
                    "var(--glass-border)",
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{
                  color: "var(--text-muted)",
                }}
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background: "var(--accent)",
              color: "white",
              boxShadow:
                "0 10px 30px var(--accent-soft)",
            }}
          >
            {loading ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Creating account...
              </>
            ) : (
              <>
                Create account
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </>
            )}
          </button>
        </form>

        {/* Login */}
        <div
          className="mt-6 border-t pt-6 text-center text-sm"
          style={{
            borderColor:
              "var(--glass-border)",
            color: "var(--text-secondary)",
          }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold transition hover:opacity-80"
            style={{
              color: "var(--accent)",
            }}
          >
            Sign in
          </Link>
        </div>

        <p
          className="mt-5 text-center text-[11px]"
          style={{
            color: "var(--text-muted)",
          }}
        >
          Your password is securely hashed before
          being stored.
        </p>
      </section>
    </main>
  );
}