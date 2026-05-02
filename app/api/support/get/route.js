import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Support from "@/models/support-models";

export async function POST(req) {
  try {
    await dbConnect();


    // Always only one support document (id = "support")
    const supportId = "support";

    // Check if support already exists
    const existingSupport = await Support.findOne({ id: supportId });

    if (existingSupport) {
      return NextResponse.json(existingSupport);
    } else {
     const newSupport = // Create new support entry
           await Support.create({ username: "Support1", avatar: "/assets/support-avatar/avatar-1.png", id: supportId });
      return NextResponse.json(existingSupport);
    }
  } catch (error) {
    console.error("Error in /api/support/update:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
