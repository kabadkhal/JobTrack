import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "jobtrack");

    const existingUser = await db
      .collection("users")
      .findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await hash(password, 12);

    const result = await db.collection("users").insertOne({
      name,
      email,
      passwordHash,

      // Every newly registered account is a normal user.
      role: "user",

      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: result.insertedId.toString(),
          name,
          email,
          role: "user",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      { message: "Something went wrong while creating the account." },
      { status: 500 }
    );
  }
}