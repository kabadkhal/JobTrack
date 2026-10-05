import { NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "jobtrack");

    const [
      totalUsers,
      totalJobs,
      totalApplications,
      totalInterviews,
    ] = await Promise.all([
      db.collection("users").countDocuments(),

      db.collection("jobs").countDocuments(),

      db.collection("jobs").countDocuments({
        status: {
          $in: [
            "applied",
            "screening",
            "interview",
            "offer",
            "rejected",
            "withdrawn",
          ],
        },
      }),

      db.collection("jobs").countDocuments({
        status: "interview",
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalJobs,
      totalApplications,
      totalInterviews,
    });
  } catch (error) {
    console.error("Admin stats error:", error);

    return NextResponse.json(
      { message: "Failed to load admin statistics." },
      { status: 500 }
    );
  }
}