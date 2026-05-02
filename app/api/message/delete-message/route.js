import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Conversation from "@/models/conversation-models";
import Message from "@/models/message-models";

export async function POST(req) {
  try {
    const { conversationID } = await req.json();
    await dbConnect();

    if (!conversationID) {
      return NextResponse.json(
        { error: "conversationID is required" },
        { status: 400 }
      );
    }

    // ✅ Conversation ডিলিট
    await Conversation.findByIdAndDelete(conversationID);

    // ✅ সেই conversationID-এর সব Message ডিলিট
    await Message.deleteMany({ conversation_id: conversationID });

    return NextResponse.json({ success: true, message: "Conversation and related messages deleted successfully." });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
