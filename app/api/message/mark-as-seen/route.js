import { NextResponse } from 'next/server';
import { dbConnect } from "@/lib/dbConnect";
import Conversation from '@/models/conversation-models';
import  Message  from '@/models/message-models';

// POST /api/start-conversation
export async function POST(req) {
  try {
    await dbConnect();
    const {conversation_id, user_id } = await req.json();
    if(!conversation_id || !user_id){return NextResponse.json({ error: 'Filed Miss' }, { status: 500 }); }
    
    // Find Conversation
    const conversation = await Conversation.findOne({ _id: conversation_id });
     if(!conversation){return NextResponse.json({ error: 'no cov' }, { status: 500 }); }

     if(user_id==="Support"){
     await Message.updateMany(
        {
          conversation_id: conversation_id,
          sender_id: { $ne: user_id }, // user_id নিজে না হলে
          status: { $ne: 'seen' }       // আগে seen না হলে
        },
        {
          $set: { status: 'seen' }
        }
      );
    }
    else{
       await Message.updateMany(
        {
          conversation_id: conversation_id,
          sender_id: "Support",
          status: { $ne: 'seen' }       // আগে seen না হলে
        },
        {
          $set: { status: 'seen' }
        }
      );
    }

    return NextResponse.json({success: true});
  } catch (error) {
    console.error('Error starting conversation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}