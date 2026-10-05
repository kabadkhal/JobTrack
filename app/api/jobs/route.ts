import { NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

const allowedStatuses = [
  "saved",
  "applied",
  "screening",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
] as const;

const allowedTypes = [
  "full-time",
  "part-time",
  "internship",
  "contract",
] as const;

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const client = await clientPromise;

    const db = client.db(
      process.env.MONGODB_DB || "jobtrack"
    );

    const jobs = await db
      .collection("jobs")
      .find({
        userId: session.user.id,
      })
      .sort({ createdAt: -1 })
      .toArray();

    const formattedJobs = jobs.map((job) => ({
      id: job._id.toString(),
      company: job.company,
      position: job.position,
      location: job.location,
      type: job.type,
      status: job.status,
      appliedDate: job.appliedDate,
      salary: job.salary,
      jobUrl: job.jobUrl,
      recruiter: job.recruiter,
      recruiterEmail: job.recruiterEmail,
      interviewDate: job.interviewDate,
      notes: job.notes,
    }));

    return NextResponse.json(formattedJobs);
  } catch (error) {
    console.error("GET /api/jobs error:", error);

    return NextResponse.json(
      { message: "Failed to fetch jobs." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const company = String(body.company || "").trim();
    const position = String(body.position || "").trim();
    const location = String(body.location || "").trim();
    const type = String(body.type || "");
    const status = String(body.status || "");
    const appliedDate = String(body.appliedDate || "");

    if (
      !company ||
      !position ||
      !location ||
      !type ||
      !status ||
      !appliedDate
    ) {
      return NextResponse.json(
        {
          message:
            "Company, position, location, type, status and applied date are required.",
        },
        { status: 400 }
      );
    }

    if (
      !allowedTypes.includes(
        type as (typeof allowedTypes)[number]
      )
    ) {
      return NextResponse.json(
        { message: "Invalid job type." },
        { status: 400 }
      );
    }

    if (
      !allowedStatuses.includes(
        status as (typeof allowedStatuses)[number]
      )
    ) {
      return NextResponse.json(
        { message: "Invalid job status." },
        { status: 400 }
      );
    }

    const client = await clientPromise;

    const db = client.db(
      process.env.MONGODB_DB || "jobtrack"
    );

    const job = {
      company,
      position,
      location,
      type,
      status,
      appliedDate,

      salary: body.salary
        ? String(body.salary).trim()
        : undefined,

      jobUrl: body.jobUrl
        ? String(body.jobUrl).trim()
        : undefined,

      recruiter: body.recruiter
        ? String(body.recruiter).trim()
        : undefined,

      recruiterEmail: body.recruiterEmail
        ? String(body.recruiterEmail).trim()
        : undefined,

      interviewDate: body.interviewDate
        ? String(body.interviewDate).trim()
        : undefined,

      notes: body.notes
        ? String(body.notes).trim()
        : undefined,

      // IMPORTANT:
      // This comes from the authenticated session.
      // Never trust userId from the browser.
      userId: session.user.id,

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("jobs").insertOne(job);

    return NextResponse.json(
      {
        id: result.insertedId.toString(),
        ...job,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/jobs error:", error);

    return NextResponse.json(
      { message: "Failed to create job." },
      { status: 500 }
    );
  }
}