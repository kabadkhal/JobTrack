import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

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

function isValidObjectId(id: string) {
  return ObjectId.isValid(id);
}

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid job ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const updates: Record<string, unknown> = {};

    const allowedFields = [
      "company",
      "position",
      "location",
      "type",
      "status",
      "appliedDate",
      "salary",
      "jobUrl",
      "recruiter",
      "recruiterEmail",
      "interviewDate",
      "notes",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] =
          typeof body[field] === "string"
            ? body[field].trim()
            : body[field];
      }
    }

    if (
      updates.type !== undefined &&
      !allowedTypes.includes(
        updates.type as (typeof allowedTypes)[number]
      )
    ) {
      return NextResponse.json(
        { message: "Invalid job type." },
        { status: 400 }
      );
    }

    if (
      updates.status !== undefined &&
      !allowedStatuses.includes(
        updates.status as (typeof allowedStatuses)[number]
      )
    ) {
      return NextResponse.json(
        { message: "Invalid job status." },
        { status: 400 }
      );
    }

    updates.updatedAt = new Date();

    const client = await clientPromise;

    const db = client.db(
      process.env.MONGODB_DB || "jobtrack"
    );

    const result = await db.collection("jobs").findOneAndUpdate(
      {
        _id: new ObjectId(id),

        // CRITICAL:
        // User can only modify their own job.
        userId: session.user.id,
      },
      {
        $set: updates,
      },
      {
        returnDocument: "after",
      }
    );

    if (!result) {
      return NextResponse.json(
        { message: "Job not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: result._id.toString(),
      company: result.company,
      position: result.position,
      location: result.location,
      type: result.type,
      status: result.status,
      appliedDate: result.appliedDate,
      salary: result.salary,
      jobUrl: result.jobUrl,
      recruiter: result.recruiter,
      recruiterEmail: result.recruiterEmail,
      interviewDate: result.interviewDate,
      notes: result.notes,
    });
  } catch (error) {
    console.error("PATCH /api/jobs/[id] error:", error);

    return NextResponse.json(
      { message: "Failed to update job." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid job ID." },
        { status: 400 }
      );
    }

    const client = await clientPromise;

    const db = client.db(
      process.env.MONGODB_DB || "jobtrack"
    );

    const result = await db.collection("jobs").deleteOne({
      _id: new ObjectId(id),

      // CRITICAL:
      // User can only delete their own job.
      userId: session.user.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Job not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE /api/jobs/[id] error:", error);

    return NextResponse.json(
      { message: "Failed to delete job." },
      { status: 500 }
    );
  }
}