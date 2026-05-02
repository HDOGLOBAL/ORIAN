import { NextResponse } from 'next/server';
import { dbConnect } from "@/lib/dbConnect";
import Conversation from '@/models/conversation-models';
import Message from '@/models/message-models';

// POST /api/start-conversation
export async function POST(req) {
  try {
    await dbConnect();
    const { conversationID } = await req.json();
    if (!conversationID) {
      return NextResponse.json({ error: 'Field Missing' }, { status: 400 });
    }

    // Find Conversation
    const conversation = await Conversation.findOne({ _id: conversationID });
    if (!conversation) {
      return NextResponse.json({ error: 'No conversation found' }, { status: 404 });
    }

    // Find all messages of this conversation
    const messageData = await Message.find({ conversation_id: conversation._id })
      .sort({ createdAt: 1 }); // ascending order

    // Get the last message
    const lastMessage = messageData[messageData.length - 1];

    // Add lastMessage field dynamically (not saved to DB unless you want)
   const conversationObj = conversation.toObject();
    conversationObj.last_seen = lastMessage ? lastMessage.createdAt : null;

    return NextResponse.json({
      success: true,
      messages: messageData,
      conversation: conversationObj,
    });
  } catch (error) {
    console.error('Error starting conversation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
