"use client";
import React, { useEffect, useState, useRef } from "react";
import MessagingUI from "@/components/chatbot/MessagingUI";
import Cookies from 'js-cookie';
import axios from 'axios';
import { io } from "socket.io-client";


export default function SupportPage() {
  const [id, setID]=useState(null);
  const [messages, setMessages] = useState([]);
  const [partner , setPartner ] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [socket, setSocket] = useState(null);
  const [supportData, setSupportData]=useState(false);

const audioRef = useRef(null);

useEffect(() => {
  audioRef.current = new Audio("/assets/fiverr-notification.mp3");
}, []);

const playNotificationSound = () => {
  if (audioRef.current) {
    audioRef.current.play().catch(err => console.log("Audio blocked:", err));
  }
};


/////Session Check
useEffect(() => {
  async function initAuth() {
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();

      if (!data.session) {
        window.location.href = "/auth/login"; // redirect client-side
      }
    } catch (err) {
      console.error(err);
      window.location.href = "/auth/login";
    }
  }
  initAuth();
}, []);

  

  // মেসেজ লোড করা (পুরনো মেসেজ)
  useEffect(() => {
    if (!id) return;

    axios.post(`/api/message/get-messages`, { conversationID: id })
      .then(res => {
        console.log(res.data);
        setPartner(res.data.conversation);

        const extractContent = (val) => {
          if (!val && val !== "") return "";
          if (typeof val === "string") return val;
          if (typeof val === "number") return String(val);
          if (typeof val === "object") {
            return (val.content || val.text || val.message || val.msg || JSON.stringify(val));
          }
          return String(val);
        };

        const msgs = Array.isArray(res.data.messages)
          ? res.data.messages.map((raw) => {
              const deep = raw?.message?.message || raw?.newMessageData?.message;
              const rawMsg = deep || raw?.message || raw?.newMessageData || raw;
              return {
                ...rawMsg,
                content: extractContent(
                  rawMsg?.content ?? rawMsg?.message ?? rawMsg?.text ?? rawMsg?.body ?? rawMsg?.msg ?? raw?.content
                ),
                createdAt:
                  rawMsg?.createdAt || rawMsg?.created_at || raw?.createdAt || raw?.created_at || new Date().toISOString(),
                conversation_id:
                  rawMsg?.conversation_id || rawMsg?.conversationID || rawMsg?.conversation || rawMsg?.conversationId || null,
              };
            })
          : [];

        setMessages(msgs);

        // mark this conversation as seen in conversations list
        setConversations((prev) => prev.map((conv) => (String(conv.conversation_id) === String(id) ? { ...conv, unread_count: 0 } : conv)));
      })
      .catch(err => {
        console.error(err);
      });
  }, [id]);

  // Socket.io connect + join conversation
  useEffect(() => {
  const socketUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  
  console.log("🔌 Support page socket connecting to:", socketUrl);
  
  const newSocket = io(socketUrl, {
      path: "/api/socket",
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });
 
setSocket(newSocket);

  newSocket.on("connect", () => {
    console.log("✅ Support socket connected:", newSocket.id);
     
  });

  newSocket.on("connect_error", (error) => {
    console.error("❌ Support socket connection error:", error);
  });

  newSocket.on("disconnect", (reason) => {
    console.warn("⚠️ Support socket disconnected:", reason);
  });

  return () => newSocket.disconnect();
}, []); 


  /////////////
  // Join room + receive-message handler (conversation-scoped)
  useEffect(() => {
    if (!socket || !id) return;

    socket.emit("joinConversation", id);
    console.log("Joined room:", id);

    socket.on("receive-message", (data) => {
      console.log("💬 Realtime message:", data);
      // normalize incoming and append if not already present
      const deep = data?.message?.message || data?.newMessageData?.message;
      const raw = deep || data?.message || data?.newMessageData || data;
      const extractContent = (val) => {
        if (!val && val !== "") return "";
        if (typeof val === "string") return val;
        if (typeof val === "number") return String(val);
        if (typeof val === "object") {
          return (val.content || val.text || val.message || val.msg || JSON.stringify(val));
        }
        return String(val);
      };

      const normalized = {
        ...raw,
        content: extractContent(
          raw?.content ?? raw?.message ?? raw?.text ?? raw?.body ?? raw?.msg ?? data?.content ?? (data?.message && data.message.content)
        ),
        createdAt:
          raw?.createdAt || raw?.created_at || data?.message?.createdAt || data?.createdAt || data?.created_at || new Date().toISOString(),
        conversation_id: raw?.conversation_id || raw?.conversationID || raw?.conversation || raw?.conversationId || null,
      };

      // dedupe by message_id or content+createdAt
      setMessages((prev) => {
        const exists = prev.some((m) => {
          if (m?.message_id && normalized?.message_id) return String(m.message_id) === String(normalized.message_id);
          if (m?.content && normalized?.content && m?.createdAt && normalized?.createdAt) {
            return m.content === normalized.content && String(m.createdAt) === String(normalized.createdAt);
          }
          return false;
        });
        if (exists) return prev;
        if (normalized.conversation_id === id) return [...prev, normalized];
        return prev;
      });
    });

    // cleanup when switching conversation
    return () => {
      socket.off("receive-message");
      socket.emit("leaveConversation", id);
    };
  }, [socket, id]);


  // Sidebar notification handler (always active while socket exists)
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (msg) => {
      // if the notification is for the currently opened conversation, ignore
      if (id === msg.conversation_id) return;
      playNotificationSound();
      console.log("🔔 Notification:", msg);
      setConversations((prevConversations) => {
        const index = prevConversations.findIndex(
          (conv) => conv.conversation_id === msg.conversation_id
        );

        if (index !== -1) {
          const updatedConversations = [...prevConversations];
          updatedConversations[index] = {
            ...updatedConversations[index],
            last_message: msg.last_message,
            last_message_time: msg.last_message_time,
            unread_count: (updatedConversations[index].unread_count || 0) + 1,
          };
          return updatedConversations;
        } else {
          return [
            {
              conversation_id: msg.conversation_id,
              avatar: msg.avatar,
              user1_id: msg.user1_id,
              user2_id: msg.user2_id,
              last_message: msg.last_message,
              last_message_time: msg.last_message_time,
              unread_count: 1,
            },
            ...prevConversations,
          ];
        }
      });
    };

    socket.on("new-message-notification", handleNotification);

    return () => {
      socket.off("new-message-notification", handleNotification);
    };
  }, [socket, id]);


  /////////////
  useEffect(() => {
  if (!socket || !supportData) return;
  console.log("[SupportPage] emitting registerSupport", supportData, "socket id", socket.id);
  socket.emit("registerSupport", supportData);
}, [socket, supportData]);


  /////////Get Conversation
   useEffect(() => {
      axios.post(`/api/message/get-conversation`)
      .then(res => {
        setConversations(res.data.conversations);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);


  /////Mark as Seen
  useEffect(() => {
    if(id){
    axios.post(`/api/message/mark-as-seen`, {conversation_id: id, user_id: "Support"});
    }
}, [id]);


  // মেসেজ পাঠানো
  const handleSendMessage = (text, file) => {
     
      axios.post(`/api/message/send-message`, {
        sender_id: "Support", conversationID: id, message: text
      })
      .then(res => {
       console.log(res.data);
       // normalize outgoing shape and merge with existing messages to avoid duplicates
       const raw = res.data.newMessageData || res.data;
       const deep = raw?.message || raw?.newMessageData || raw;
       const extractContent = (val) => {
         if (!val && val !== "") return "";
         if (typeof val === "string") return val;
         if (typeof val === "number") return String(val);
         if (typeof val === "object") return (val.content || val.text || val.message || val.msg || JSON.stringify(val));
         return String(val);
       };

       const normalized = {
         ...deep,
         content: extractContent(deep?.content ?? deep?.message ?? deep?.text ?? deep?.body ?? deep?.msg ?? raw?.content),
         createdAt: deep?.createdAt || deep?.created_at || raw?.createdAt || new Date().toISOString(),
         conversation_id: deep?.conversation_id || deep?.conversationID || deep?.conversation || deep?.conversationId || id,
       };

       setMessages((prev) => {
         // dedupe by message_id
         if (normalized?.message_id && prev.some(m => m?.message_id && String(m.message_id) === String(normalized.message_id))) return prev;
         // replace placeholder matched by content+createdAt
         const placeholderIdx = prev.findIndex(m => m?.content && normalized?.content && m?.createdAt && normalized?.createdAt && m.content === normalized.content && String(m.createdAt) === String(normalized.createdAt));
         if (placeholderIdx !== -1) {
           const copy = [...prev];
           copy[placeholderIdx] = { ...copy[placeholderIdx], ...normalized };
           return copy;
         }
         return [...prev, normalized];
       });

       // emit message to socket (send to other party)
       socket.emit("send-message", raw);
       if (res.data.notification) socket.emit("send-notification", res.data.notification);
      })
      .catch(err => {
        console.error(err);
      });
  };

////Delete Message
const handelDeleteConv=()=>{
    axios.post(`/api/message/delete-message`, {conversationID: id})
      .then(res => {
       console.log(res.data);
       ////
       setConversations(prev => prev.filter(conv => conv.conversation_id !== id));
       setID(null);
      })
      .catch(err => {
        console.error(err);
      });
};

  return (
   
      <div className="bg-[#ffffff] text-white  space-y-10 max-w-screen-xl mx-auto">
        <MessagingUI 
          messages={messages} 
          partner={partner}
          conversationID={id}
          conversations={conversations}
          onSend={(text, file) => handleSendMessage(text, file)}
          onConv={e=>setID(e)}
          onDelete={handelDeleteConv}
          onSupportData={e=>setSupportData(e)}
        />
      </div>
  );
}
