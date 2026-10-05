import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function PATCH(request: Request) {
  try {
    // Get logged-in user
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    // Validate MongoDB user ID
    if (!ObjectId.isValid(session.user.id)) {
      return NextResponse.json(
        {
          message: "Invalid user ID.",
        },
        {
          status: 400,
        }
      );
    }

    // Read request body
    const body = await request.json();

    const name = String(body?.name ?? "").trim();

    // Validate name
    if (!name) {
      return NextResponse.json(
        {
          message: "Name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (name.length > 80) {
      return NextResponse.json(
        {
          message:
            "Name cannot exceed 80 characters.",
        },
        {
          status: 400,
        }
      );
    }

    // Connect MongoDB
    const client = await clientPromise;

    const db = client.db(
      process.env.MONGODB_DB || "jobtrack"
    );

    // Update ONLY the logged-in user's account
    const result = await db
      .collection("users")
      .updateOne(
        {
          _id: new ObjectId(session.user.id),
        },
        {
          $set: {
            name,
            updatedAt: new Date(),
          },
        }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          message: "User account not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Profile updated successfully.",
    });
  } catch (error) {
    console.error(
      "PROFILE UPDATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to update profile.",
      },
      {
        status: 500,
      }
    );
  }
}