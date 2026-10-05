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

    const users = await db
      .collection("users")
      .find(
        {},
        {
          projection: {
            passwordHash: 0,
          },
        }
      )
      .sort({ createdAt: -1 })
      .toArray();

    const formattedUsers = users.map((user) => ({
      id: user._id.toString(),
      name: String(user.name || ""),
      email: String(user.email || ""),
      role: String(user.role || "user"),
      createdAt: user.createdAt || null,
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error("Admin users error:", error);

    return NextResponse.json(
      { message: "Failed to load users." },
      { status: 500 }
    );
  }
}