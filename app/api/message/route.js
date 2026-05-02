import { NextResponse } from 'next/server';
import { dbConnect } from "@/lib/dbConnect";
import Conversation from '@/models/conversation-models';

// POST /api/start-conversation
export async function POST(req) {
  try {
    await dbConnect();
    const { user1_id, email } = await req.json();
    if(!user1_id || !email){return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }

    // create new
   const conversation = await Conversation.create({ user1_id, email, user2_id:"Support" });
    

    return NextResponse.json({conversation_id: conversation._id});
  } catch (error) {
    console.error('Error starting conversation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
