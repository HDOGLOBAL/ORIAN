import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Support from "@/models/support-models";

export async function POST(req) {
  try {
    await dbConnect();

    const { avatar, username } = await req.json();

    if (!avatar || !username) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Always only one support document (id = "support")
    const supportId = "support";

    // Check if support already exists
    const existingSupport = await Support.findOne({ id: supportId });

    if (existingSupport) {
      // Update existing support
      existingSupport.username = username;
      existingSupport.avatar = avatar;
      await existingSupport.save();

      return NextResponse.json({
        success: true,
        message: "Support info updated successfully",
      });
    } else {
      // Create new support entry
      await Support.create({ username, avatar, id: supportId });
      return NextResponse.json({
        success: true,
        message: "Support created successfully",
      });
    }
  } catch (error) {
    console.error("Error in /api/support/update:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
