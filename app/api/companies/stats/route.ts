import { NextResponse } from "next/server";

import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const userId = String(session.user.id);

    const client = await clientPromise;

    const db = client.db(
      process.env.MONGODB_DB || "jobtrack"
    );

    const jobs = await db
      .collection("jobs")
      .find({ userId })
      .sort({ appliedDate: -1 })
      .toArray();

    const companyMap = new Map<
      string,
      {
        company: string;
        applications: number;
        interviews: number;
        offers: number;
        rejected: number;
        saved: number;
        screening: number;
        withdrawn: number;
        jobs: typeof jobs;
      }
    >();

    for (const job of jobs) {
      const company = String(
        job.company || "Unknown"
      ).trim();

      if (!company) continue;

      const existing = companyMap.get(company);

      if (existing) {
        existing.applications += 1;

        if (job.status === "interview") {
          existing.interviews += 1;
        }

        if (job.status === "offer") {
          existing.offers += 1;
        }

        if (job.status === "rejected") {
          existing.rejected += 1;
        }

        if (job.status === "saved") {
          existing.saved += 1;
        }

        if (job.status === "screening") {
          existing.screening += 1;
        }

        if (job.status === "withdrawn") {
          existing.withdrawn += 1;
        }

        existing.jobs.push(job);
      } else {
        companyMap.set(company, {
          company,
          applications: 1,
          interviews:
            job.status === "interview" ? 1 : 0,
          offers:
            job.status === "offer" ? 1 : 0,
          rejected:
            job.status === "rejected" ? 1 : 0,
          saved:
            job.status === "saved" ? 1 : 0,
          screening:
            job.status === "screening" ? 1 : 0,
          withdrawn:
            job.status === "withdrawn" ? 1 : 0,
          jobs: [job],
        });
      }
    }

    const companies = Array.from(
      companyMap.values()
    )
      .sort(
        (a, b) =>
          b.applications - a.applications
      )
      .map((company) => ({
        company: company.company,
        applications: company.applications,
        interviews: company.interviews,
        offers: company.offers,
        rejected: company.rejected,
        saved: company.saved,
        screening: company.screening,
        withdrawn: company.withdrawn,

        jobs: company.jobs.map((job) => ({
          id: String(job._id),
          company: String(job.company || ""),
          position: String(job.position || ""),
          location: String(job.location || ""),
          type: String(job.type || ""),
          status: String(job.status || ""),
          appliedDate: String(
            job.appliedDate || ""
          ),
          salary: job.salary
            ? String(job.salary)
            : undefined,
          jobUrl: job.jobUrl
            ? String(job.jobUrl)
            : undefined,
          recruiter: job.recruiter
            ? String(job.recruiter)
            : undefined,
          recruiterEmail:
            job.recruiterEmail
              ? String(job.recruiterEmail)
              : undefined,
          interviewDate:
            job.interviewDate
              ? String(job.interviewDate)
              : undefined,
          notes: job.notes
            ? String(job.notes)
            : undefined,
        })),
      }));

    return NextResponse.json({
      totalCompanies: companies.length,
      totalApplications: jobs.length,
      companies,
    });
  } catch (error) {
    console.error(
      "COMPANIES STATS ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to load company statistics.",
      },
      { status: 500 }
    );
  }
}