import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { compare, hash } from "bcryptjs";

import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    if (!ObjectId.isValid(session.user.id)) {
      return NextResponse.json(
        { message: "Invalid user ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const currentPassword = String(
      body?.currentPassword ?? ""
    );

    const newPassword = String(
      body?.newPassword ?? ""
    );

    if (!currentPassword) {
      return NextResponse.json(
        {
          message:
            "Current password is required.",
        },
        { status: 400 }
      );
    }

    if (!newPassword) {
      return NextResponse.json(
        {
          message:
            "New password is required.",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          message:
            "New password must contain at least 8 characters.",
        },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        {
          message:
            "New password must be different from your current password.",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;

    const db = client.db(
      process.env.MONGODB_DB || "jobtrack"
    );

    const user = await db
      .collection("users")
      .findOne({
        _id: new ObjectId(session.user.id),
      });

    if (!user) {
      return NextResponse.json(
        {
          message: "User account not found.",
        },
        { status: 404 }
      );
    }

    const passwordMatches = await compare(
      currentPassword,
      String(user.passwordHash)
    );

    if (!passwordMatches) {
      return NextResponse.json(
        {
          message:
            "Current password is incorrect.",
        },
        { status: 400 }
      );
    }

    const newPasswordHash = await hash(
      newPassword,
      12
    );

    await db.collection("users").updateOne(
      {
        _id: new ObjectId(session.user.id),
      },
      {
        $set: {
          passwordHash: newPasswordHash,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message:
        "Password changed successfully.",
    });
  } catch (error) {
    console.error(
      "PASSWORD CHANGE ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to change password.",
      },
      { status: 500 }
    );
  }
}