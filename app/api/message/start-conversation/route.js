import { NextResponse } from 'next/server';
import { dbConnect } from "@/lib/dbConnect";
import Conversation from '@/models/conversation-models';
import Message  from '@/models/message-models';

// POST /api/start-conversation
export async function POST(req) {
  try {
    await dbConnect();
    const { user1_id, email, message } = await req.json();
    if(!user1_id || !email || !message){return NextResponse.json({ error: 'fill not' }, { status: 500 }); }
    const rand = Math.floor(Math.random() * 50) + 1;
    const padded = String(rand).padStart(2, '0');
    const avatar = `/assets/avatar/Avatars Set Flat Style-${padded}.png`;
    // create new
    const conversation = await Conversation.create({ user1_id, email, user2_id: "Support", avatar });
    console.log(conversation._id)
    const messageData = await Message.create({
          conversation_id: conversation._id,
          email: conversation.email,
          sender_id: user1_id,
          receiver_id: "Support",
          content: message,
          status: "sent"
    });

    const notification = {
          conversation_id: conversation._id,
          avatar: conversation.avatar,
          email: conversation.email,
          user1_id: user1_id,
          user2_id: "Support",
          last_message: message,
          last_message_time: messageData.createdAt
            };

       const newMessageData = {
              conversationID: conversation._id,
              message: {
                message_id: messageData.id,
                conversation_id: conversation._id,
                sender_id: user1_id,
                content: message,
                status: messageData.status,
                createdAt: messageData.createdAt
              },
            };

     // ✅ রিয়েলটাইম আপডেট: সেই conversationID রুমে মেসেজ পাঠানো
    // if (global._io) {
    //  // সাথে সবাইকে নোটিফিকেশন পাঠানো
    //    _io.emit("new-message-notification", {
    //       conversation_id: conversation._id,
    //       avatar: conversation.avatar,
    //       email: conversation.email,
    //       user1_id: user1_id,
    //       user2_id: "Support",
    //       last_message: message,
    //       last_message_time: messageData.createdAt
    //     });
    // }

    return NextResponse.json({conversation_id: conversation._id, notification, messageData, newMessageData});
  } catch (error) {
    console.error('Error starting conversation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
