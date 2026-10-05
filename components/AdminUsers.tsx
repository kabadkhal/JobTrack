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
    <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-400">
          User Management
        </p>

        <h2 className="mt-2 text-2xl font-semibold">
          Registered Users
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          View the accounts registered on JobTrack.
        </p>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-20 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-5">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
          <p className="text-sm text-slate-400">
            No registered users found.
          </p>
        </div>
      )}

      {!loading && !error && users.length > 0 && (
        <div className="overflow-x-auto">
          <div className="min-w-[720px]">
            <div className="grid grid-cols-[1.5fr_2fr_1fr_1.2fr] gap-4 border-b border-white/10 px-4 pb-3 text-xs font-medium uppercase tracking-wider text-slate-500">
              <span>User</span>
              <span>Email</span>
              <span>Role</span>
              <span>Joined</span>
            </div>

            <div className="divide-y divide-white/5">
              {users.map((user) => {
                const isAdmin = user.role === "admin";

                return (
                  <div
                    key={user.id}
                    className="grid grid-cols-[1.5fr_2fr_1fr_1.2fr] items-center gap-4 px-4 py-4 transition hover:bg-white/[0.03]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
                        {isAdmin ? (
                          <ShieldCheck
                            size={18}
                            className="text-cyan-400"
                          />
                        ) : (
                          <UserRound
                            size={18}
                            className="text-slate-400"
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-medium text-white">
                          {user.name || "Unnamed User"}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                          ID: {user.id}
                        </p>
                      </div>
                    </div>

                    <p className="truncate text-sm text-slate-300">
                      {user.email}
                    </p>

                    <div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          isAdmin
                            ? "bg-cyan-400/10 text-cyan-300"
                            : "bg-white/[0.06] text-slate-300"
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>

                    <p className="text-sm text-slate-400">
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