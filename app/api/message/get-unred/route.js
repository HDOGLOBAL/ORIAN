import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Conversation from "@/models/conversation-models";
import Message from "@/models/message-models";

export async function POST(req) {
  try {
    await dbConnect();

     const {conversation_id} = await req.json();
    if(!conversation_id){return NextResponse.json({ error: 'Filed Miss' }, { status: 500 }); }


        const unreadCount = await Message.countDocuments({
          conversation_id,
          sender_id: "Support" ,
          status: { $ne: "seen" },
        });


    return NextResponse.json({ success: true, unreadCount });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
