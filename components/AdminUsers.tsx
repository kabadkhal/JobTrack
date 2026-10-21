"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, UserRound } from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string | null;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/admin/users", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Failed to load users.");
        }

        setUsers(data);
      } catch (error) {
        console.error("Failed to load admin users:", error);
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  function formatDate(date: string | null) {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <section className="mt-8 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--accent)]">
          User Management
        </p>

        <h2 className="mt-2 text-2xl font-semibold">
          Registered Users
        </h2>

        <p className="mt-1 text-sm text-[color:var(--text-secondary)]">
          View the accounts registered on JobTrack.
        </p>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-20 animate-pulse rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)]"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-[color:var(--danger-border)] bg-[color:var(--danger-soft)] p-5">
          <p className="text-sm text-[color:var(--danger)]">{error}</p>
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-8 text-center">
          <p className="text-sm text-[color:var(--text-secondary)]">
            No registered users found.
          </p>
        </div>
      )}

      {!loading && !error && users.length > 0 && (
        <div className="overflow-x-auto">
          <div className="min-w-[720px]">
            <div className="grid grid-cols-[1.5fr_2fr_1fr_1.2fr] gap-4 border-b border-[color:var(--border)] px-4 pb-3 text-xs font-medium uppercase tracking-wider text-[color:var(--text-muted)]">
              <span>User</span>
              <span>Email</span>
              <span>Role</span>
              <span>Joined</span>
            </div>

            <div className="divide-y divide-[color:var(--border-soft)]">
              {users.map((user) => {
                const isAdmin = user.role === "admin";

                return (
                  <div
                    key={user.id}
                    className="grid grid-cols-[1.5fr_2fr_1fr_1.2fr] items-center gap-4 px-4 py-4 transition hover:bg-[color:var(--surface-hover)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)]">
                        {isAdmin ? (
                          <ShieldCheck
                            size={18}
                            className="text-[color:var(--accent)]"
                          />
                        ) : (
                          <UserRound
                            size={18}
                            className="text-[color:var(--text-secondary)]"
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-medium text-[color:var(--text-primary)]">
                          {user.name || "Unnamed User"}
                        </p>

                        <p className="truncate text-xs text-[color:var(--text-muted)]">
                          ID: {user.id}
                        </p>
                      </div>
                    </div>

                    <p className="truncate text-sm text-[color:var(--text-secondary)]">
                      {user.email}
                    </p>

                    <div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          isAdmin
                            ? "bg-[color:var(--accent-soft)] text-[color:var(--accent)]"
                            : "bg-[color:var(--surface-hover)] text-[color:var(--text-secondary)]"
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>

                    <p className="text-sm text-[color:var(--text-secondary)]">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}