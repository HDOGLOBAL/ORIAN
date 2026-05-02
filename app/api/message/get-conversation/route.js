import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Conversation from "@/models/conversation-models";
import Message from "@/models/message-models";

export async function POST(req) {
  try {
    await dbConnect();

    // ডেমো হিসেবে fixed user_id
    const user_id = "Support";

    if (!user_id) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    }

    // সব conversation এনে নাও
    const conversations = await Conversation.find()
      .sort({ updatedAt: -1 })
      .lean();

    // প্রতিটি conversation প্রক্রিয়া করা
    const result = await Promise.all(
      conversations.map(async (conv) => {
        // unread count বের করা
        const unreadCount = await Message.countDocuments({
          conversation_id: conv._id,
          sender_id: { $ne: "Support" },
          status: { $ne: "seen" },
        });

        // শেষ মেসেজ বের করা
        const lastMessage = await Message.findOne({
          conversation_id: conv._id,
        })
          .sort({ createdAt: -1 })
          .lean();

        return {
          conversation_id: conv._id,
          avatar: conv.avatar,
          email: conv.email,
          user1_id: conv.user1_id,
          user2_id: conv.user2_id,
          last_message: lastMessage ? lastMessage.content : null,
          last_message_time: lastMessage ? lastMessage.createdAt : null,
          unread_count: unreadCount,
        };
      })
    );

    return NextResponse.json({ success: true, conversations: result });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
