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

    const totalJobs = await jobs.countDocuments({
      userId,
    });

    const savedJobs = await jobs.countDocuments({
      userId,
      status: "saved",
    });

    const appliedJobs = await jobs.countDocuments({
      userId,
      status: "applied",
    });

    const screeningJobs = await jobs.countDocuments({
      userId,
      status: "screening",
    });

    const interviewJobs = await jobs.countDocuments({
      userId,
      status: "interview",
    });

    const offerJobs = await jobs.countDocuments({
      userId,
      status: "offer",
    });

    const rejectedJobs = await jobs.countDocuments({
      userId,
      status: "rejected",
    });

    const withdrawnJobs = await jobs.countDocuments({
      userId,
      status: "withdrawn",
    });

    return NextResponse.json({
      totalJobs,
      savedJobs,
      appliedJobs,
      screeningJobs,
      interviewJobs,
      offerJobs,
      rejectedJobs,
      withdrawnJobs,
    });
  } catch (error) {
    console.error(
      "DASHBOARD STATS ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to load dashboard statistics.",
      },
      { status: 500 }
    );
  }
}