import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminStats from "@/components/AdminStats";
import AdminUsers from "@/components/AdminUsers";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <main className="min-h-screen px-4 pt-24 pb-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Monitor users, jobs, applications and interviews across JobTrack.
          </p>
        </div>

        <AdminStats />
        <AdminUsers />

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
          <h2 className="text-lg font-semibold">Administrator</h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
              <p className="text-sm text-slate-400">Name</p>

              <p className="mt-1 font-medium">
                {session.user.name || "Administrator"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
              <p className="text-sm text-slate-400">Role</p>

              <p className="mt-1 font-medium text-cyan-400">
                {session.user.role}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}