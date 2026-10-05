"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";

import {
  ArrowRight,
  BriefcaseBusiness,
  Lock,
  Mail,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    window.location.href = "/";
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--accent-soft), transparent 65%)",
        }}
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: "var(--accent-soft)",
                color: "var(--accent)",
              }}
            >
              <BriefcaseBusiness size={20} />
            </div>

            <span
              className="text-xl font-semibold tracking-tight"
              style={{
                color: "var(--text-primary)",
              }}
            >
              JobTrack
            </span>
          </Link>

          <p
            className="mt-3 text-sm"
            style={{
              color: "var(--text-muted)",
            }}
          >
            Your career command center
          </p>
        </div>

        {/* Login Card */}
        <div className="glass rounded-3xl p-7 sm:p-8">
          <div className="mb-7">
            <h1
              className="text-2xl font-semibold"
              style={{
                color: "var(--text-primary)",
              }}
            >
              Welcome back
            </h1>

            <p
              className="mt-2 text-sm"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              Sign in to continue managing your job search.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
                style={{
                  color: "var(--text-secondary)",
                }}
              >
                Email
              </label>

              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{
                    color: "var(--text-muted)",
                  }}
                />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="h-12 w-full rounded-xl border pl-11 pr-4 text-sm outline-none transition focus:ring-2"
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
                style={{
                  color: "var(--text-secondary)",
                }}
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{
                    color: "var(--text-muted)",
                  }}
                />

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="h-12 w-full rounded-xl border pl-11 pr-4 text-sm outline-none transition focus:ring-2"
                  style={{
                    color: "var(--text-primary)",
                    background: "var(--glass)",
                    borderColor:
                      "var(--glass-border)",
                  }}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="rounded-xl border px-4 py-3 text-sm"
                style={{
                  color: "var(--danger)",
                  background:
                    "rgba(239, 68, 68, 0.08)",
                  borderColor:
                    "rgba(239, 68, 68, 0.18)",
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                color: "#ffffff",
                background: "var(--accent)",
                boxShadow:
                  "0 10px 30px rgba(139, 92, 246, 0.20)",
              }}
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign in

                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>

          {/* New user registration */}
          <div
            className="mt-6 border-t pt-6 text-center text-sm"
            style={{
              borderColor: "var(--glass-border)",
              color: "var(--text-secondary)",
            }}
          >
            Don't have an account?{" "}

            <Link
              href="/register"
              className="font-semibold transition hover:opacity-80"
              style={{
                color: "var(--accent)",
              }}
            >
              Create account
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p
          className="mt-6 text-center text-xs"
          style={{
            color: "var(--text-muted)",
          }}
        >
          JobTrack · Your career command center
        </p>
      </motion.div>
    </main>
  );
}