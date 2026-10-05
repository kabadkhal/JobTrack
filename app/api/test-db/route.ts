import { NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;

    await client
      .db(process.env.MONGODB_DB || "jobtrack")
      .command({
        ping: 1,
      });

    return NextResponse.json({
      success: true,
      message: "MongoDB connected successfully",
    });
  } catch (error) {
    console.error("=================================");
    console.error("MONGODB CONNECTION ERROR");
    console.error(error);
    console.error("=================================");

    return NextResponse.json(
      {
        success: false,
        message: "MongoDB connection failed",
        error:
          error instanceof Error
            ? error.message
            : "Unknown MongoDB error",
      },
      {
        status: 500,
      }
    );
  }
}