import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Conversation from "@/models/conversation-models";
import Message from "@/models/message-models";

// POST /api/start-conversation
export async function POST(req) {
  try {
    await dbConnect();
    const { sender_id, conversationID, message } = await req.json();
    if (!conversationID || !message || !sender_id) {
      return NextResponse.json({ error: "Field Missing" }, { status: 400 });
    }

    const conversation = await Conversation.findOne({ _id: conversationID });
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const sender = sender_id === "Support" ? "Support" : conversation.user1_id;
    const receiver = sender_id === "Support" ? conversation.user1_id : "Support";

    const messageData = await Message.create({
      conversation_id: conversation._id,
      sender_id: sender,
      receiver_id: receiver,
      content: message,
    });

    const newMessageData = {
              conversationID,
              message: {
                message_id: messageData.id,
                conversation_id: conversationID,
                sender_id: sender,
                content: message,
                status: messageData.status,
                createdAt: messageData.createdAt
              },
            };

    const notification = {
          conversation_id: conversationID,
          avatar: conversation.avatar,
          email: conversation.email,
          user1_id: sender,
          user2_id: "Support",
          last_message: message,
          last_message_time: messageData.createdAt
        };

    // // ✅ রিয়েলটাইম আপডেট: সেই conversationID রুমে মেসেজ পাঠানো
    // if (global._io) {
    //   // নির্দিষ্ট রুমে পাঠানো
    //   global._io.to(conversationID).emit("receive-message", {
    //     message_id: messageData.id,
    //     conversation_id: conversationID,
    //     sender_id: sender,
    //     content: message,
    //     status: messageData.status,
    //     createdAt: messageData.createdAt
    //   });

    //   // সাথে সবাইকে নোটিফিকেশন পাঠানো
    //   if(sender_id!="Support"){
    //    _io.emit("new-message-notification", {
    //       conversation_id: conversationID,
    //       avatar: conversation.avatar,
    //       email: conversation.email,
    //       user1_id: sender,
    //       user2_id: "Support",
    //       last_message: message,
    //       last_message_time: messageData.createdAt
    //     });
    //   }
    //   console.log("📤 Socket broadcast done for room:", conversationID);
    // }

    return NextResponse.json({ success: true, message: messageData, newMessageData, notification });
  } catch (error) {
    console.error("Error starting conversation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
