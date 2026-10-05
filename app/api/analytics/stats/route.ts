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

    const jobs = db.collection("jobs");

    /*
     * Get only jobs belonging to the
     * currently logged-in user.
     */
    const userJobs = await jobs
      .find({ userId })
      .sort({ appliedDate: 1 })
      .toArray();

    /*
     * -----------------------------
     * BASIC COUNTS
     * -----------------------------
     */

    const totalApplications = userJobs.length;

    const saved = userJobs.filter(
      (job) => job.status === "saved"
    ).length;

    const applied = userJobs.filter(
      (job) => job.status === "applied"
    ).length;

    const screening = userJobs.filter(
      (job) => job.status === "screening"
    ).length;

    const interviews = userJobs.filter(
      (job) => job.status === "interview"
    ).length;

    const offers = userJobs.filter(
      (job) => job.status === "offer"
    ).length;

    const rejected = userJobs.filter(
      (job) => job.status === "rejected"
    ).length;

    const withdrawn = userJobs.filter(
      (job) => job.status === "withdrawn"
    ).length;

    /*
     * -----------------------------
     * SUCCESS METRICS
     * -----------------------------
     *
     * We use applications that reached
     * a meaningful hiring stage.
     */

    const activeApplications =
      totalApplications - saved - withdrawn;

    const interviewRate =
      activeApplications > 0
        ? Number(
            ((interviews / activeApplications) * 100).toFixed(1)
          )
        : 0;

    const offerRate =
      activeApplications > 0
        ? Number(
            ((offers / activeApplications) * 100).toFixed(1)
          )
        : 0;

    const rejectionRate =
      activeApplications > 0
        ? Number(
            ((rejected / activeApplications) * 100).toFixed(1)
          )
        : 0;

    const responseRate =
      activeApplications > 0
        ? Number(
            (((interviews + offers) / activeApplications) * 100).toFixed(
              1
            )
          )
        : 0;

    /*
     * -----------------------------
     * PIPELINE
     * -----------------------------
     */

    const pipeline = [
      {
        status: "saved",
        label: "Saved",
        count: saved,
      },
      {
        status: "applied",
        label: "Applied",
        count: applied,
      },
      {
        status: "screening",
        label: "Screening",
        count: screening,
      },
      {
        status: "interview",
        label: "Interview",
        count: interviews,
      },
      {
        status: "offer",
        label: "Offer",
        count: offers,
      },
      {
        status: "rejected",
        label: "Rejected",
        count: rejected,
      },
      {
        status: "withdrawn",
        label: "Withdrawn",
        count: withdrawn,
      },
    ];

    /*
     * -----------------------------
     * APPLICATION TREND
     * -----------------------------
     *
     * Group applications by month.
     */

    const monthlyMap: Record<string, number> = {};

    userJobs.forEach((job) => {
      if (!job.appliedDate) return;

      const date = new Date(job.appliedDate);

      if (Number.isNaN(date.getTime())) return;

      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const key = `${year}-${String(month).padStart(2, "0")}`;

      monthlyMap[key] =
        (monthlyMap[key] || 0) + 1;
    });

    const applicationTrend = Object.entries(
      monthlyMap
    )
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({
        month,
        count,
      }));

    /*
     * -----------------------------
     * TOP COMPANIES
     * -----------------------------
     */

    const companyMap: Record<string, number> = {};

    userJobs.forEach((job) => {
      const company = String(
        job.company || "Unknown"
      ).trim();

      if (!company) return;

      companyMap[company] =
        (companyMap[company] || 0) + 1;
    });

    const topCompanies = Object.entries(
      companyMap
    )
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([company, count]) => ({
        company,
        count,
      }));

    /*
     * -----------------------------
     * JOB TYPE BREAKDOWN
     * -----------------------------
     */

    const jobTypeMap: Record<string, number> = {};

    userJobs.forEach((job) => {
      const type = String(
        job.type || "unknown"
      );

      jobTypeMap[type] =
        (jobTypeMap[type] || 0) + 1;
    });

    const jobTypes = Object.entries(
      jobTypeMap
    ).map(([type, count]) => ({
      type,
      count,
    }));

    /*
     * -----------------------------
     * LOCATION BREAKDOWN
     * -----------------------------
     */

    const locationMap: Record<string, number> = {};

    userJobs.forEach((job) => {
      const location = String(
        job.location || "Unknown"
      ).trim();

      if (!location) return;

      locationMap[location] =
        (locationMap[location] || 0) + 1;
    });

    const topLocations = Object.entries(
      locationMap
    )
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([location, count]) => ({
        location,
        count,
      }));

    /*
     * -----------------------------
     * FINAL RESPONSE
     * -----------------------------
     */

    return NextResponse.json({
      overview: {
        totalApplications,
        activeApplications,
        saved,
        applied,
        screening,
        interviews,
        offers,
        rejected,
        withdrawn,
      },

      metrics: {
        interviewRate,
        offerRate,
        rejectionRate,
        responseRate,
      },

      pipeline,

      applicationTrend,

      topCompanies,

      jobTypes,

      topLocations,
    });
  } catch (error) {
    console.error(
      "ANALYTICS STATS ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to load analytics statistics.",
      },
      { status: 500 }
    );
  }
}