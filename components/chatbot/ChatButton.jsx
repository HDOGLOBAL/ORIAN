"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSupportStatus } from "@/providers/SupportStatusProvider";
import axios from 'axios';
import Cookies from 'js-cookie';
import activeStatus from "@/utils/clients/activeStatus";
import { HiDotsVertical, HiOutlineDotsVertical } from "react-icons/hi";
import { IoChatbubble } from "react-icons/io5";
import Send from "../svg/Send";
import { io } from "socket.io-client"; 
import { MdEmail } from "react-icons/md";
import Link from "next/link";

export default function ChatButton({ initialOpen = false }) {
  const { isSupportOnline, setSupportOnline } = useSupportStatus?.() || { isSupportOnline: false, setSupportOnline: () => {} };
  const [name, setName]=useState('');
 const [email, setEmail]=useState('');
 const [message, setMessage]=useState('');
 const [isOpen, setIsOpen] = useState(initialOpen);
 const [messages, setMessages] = useState([]);
 const [conversationLoading, setConversationLoading] = useState(null);
 const [expireChat, setExpireChat]=useState(false);
 const [conversationID, setConversationID] = useState(Cookies.get('conversation') || null);
 const [text, setText]=useState('');
 const [isProgress, setIsProgress]=useState(false);
 const [supportOffline, setSupportOffline]=useState(false);
 const messagesEndRef = useRef(null);
 const [unreadCount, setUnreadCount]=useState(0)
 const [socket, setSocket] = useState(null);
   const [supportData, setSupportData]=useState(false);
 

 const playSound = (url) => {
  const audio = new Audio(url);
  audio.volume = 0.7; // ভলিউম কম রাখো
  audio.play().catch(err => {
    console.log("Audio play blocked:", err);
  });
};

  const normalizeMessage = (raw) => {
    if (!raw) return { content: "", createdAt: new Date().toISOString() };
    const extractContent = (val) => {
      if (!val && val !== "") return "";
      if (typeof val === "string") return val;
      if (typeof val === "number") return String(val);
      if (typeof val === "object") {
        return (val.content || val.text || val.message || val.msg || JSON.stringify(val));
      }
      return String(val);
    };

    // handle payloads that wrap the actual message in multiple layers:
    // e.g. { message: { message: { ... } }, createdAt }
    const deep = raw?.message?.message || raw?.newMessageData?.message;
    const rawMsg = deep || raw?.message || raw?.newMessageData || raw;

    return {
      ...rawMsg,
      // prefer nested value, then top-level fallback on the full payload
      content: extractContent(
        rawMsg?.content ?? rawMsg?.message ?? rawMsg?.text ?? rawMsg?.body ?? rawMsg?.msg ?? raw?.content ?? (raw?.message && raw.message.content)
      ),
      createdAt:
        rawMsg?.createdAt || rawMsg?.created_at || raw?.message?.createdAt || raw?.createdAt || raw?.created_at || new Date().toISOString(),
      conversation_id: rawMsg?.conversation_id || rawMsg?.conversationID || rawMsg?.conversation || rawMsg?.conversationId || null,
    };
  };

  const messageExists = (list, msg) => {
    if (!msg) return false;
    return list.some((m) => {
      if (m?.message_id && msg?.message_id) return String(m.message_id) === String(msg.message_id);
      // fallback: match by content + createdAt
      if (m?.content && msg?.content && m?.createdAt && msg?.createdAt) {
        return m.content === msg.content && String(m.createdAt) === String(msg.createdAt);
      }
      return false;
    });
  };

  const addMessage = (msg) => {
    const normalized = normalizeMessage(msg);
    setMessages((prev) => {
      // try to find by message_id
      const byIdIdx = prev.findIndex((m) => m?.message_id && normalized?.message_id && String(m.message_id) === String(normalized.message_id));
      if (byIdIdx !== -1) {
        // already present with same id
        return prev;
      }

      // try to find placeholder by content+createdAt
      const placeholderIdx = prev.findIndex((m) => {
        if (m?.content && normalized?.content && m?.createdAt && normalized?.createdAt) {
          return m.content === normalized.content && String(m.createdAt) === String(normalized.createdAt);
        }
        return false;
      });

      if (placeholderIdx !== -1) {
        // if incoming has a message_id and placeholder doesn't, replace it
        const existing = prev[placeholderIdx];
        if ((!existing?.message_id && normalized?.message_id) || existing?.message_id !== normalized?.message_id) {
          const copy = [...prev];
          copy[placeholderIdx] = { ...copy[placeholderIdx], ...normalized };
          return copy;
        }
        return prev;
      }

      // otherwise append
      return [...prev, normalized];
    });
  };


 // ✅ Ref to keep the latest isOpen value
  const isOpenRef = useRef(isOpen);
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // ✅ Socket.io connections
  useEffect(() => {
    const socketUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    
    console.log("🔌 Initializing socket with URL:", socketUrl);
    
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
      console.log("✅ Socket connected:", newSocket.id);
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
    });

    newSocket.on("disconnect", (reason) => {
      console.warn("⚠️ Socket disconnected:", reason);
    });
    
   setConversationLoading(true);
    return () => {
      newSocket.disconnect();
    };
  }, []);


  //////
useEffect(() => {
  if (!socket || !conversationID) return;

  socket.emit("joinConversation", conversationID);
  console.log("Joined room:", conversationID);

  return () => {
    socket.emit("leaveConversation", conversationID);
  };
}, [socket, conversationID]);


////////
useEffect(() => {
  if (!socket) return;

  socket.on("receive-message", (data) => {
    console.log("Realtime message:", data);
    const normalized = normalizeMessage(data);

    addMessage(normalized);
    setSupportData(data.support);
    setConversationLoading(true);

    // always play sound when a message arrives
    playSound("/assets/fiverr-notification.mp3");

    // increment unread only when the chat is closed
    if (!isOpenRef.current) {
      setUnreadCount((prev) => prev + 1);
    }
  });

  socket.on("no-support-online", () => {
    console.log("<< Socket Event: no-support-online >>");
    setSupportOffline(true);
    setSupportOnline(false);
    setConversationLoading(true);
  });

  socket.on("support-online", (support) => {
    console.log("<< Socket Event: support-online >>", support);
    setSupportOffline(false);
    setSupportOnline(true);
    setSupportData(support || false);
  });

  socket.on("support-offline", () => {
    console.log("<< Socket Event: support-offline >>");
    setSupportOffline(true);
    setSupportOnline(false);
    setSupportData(false);
  });

  socket.on("support-status", (data) => {
    console.log("<< Socket Event: support-status >>", data);
    const online = !!data?.online;
    setSupportOffline(!online);
    setSupportOnline(online);
    setSupportData(data?.support || false);
  });

  return () => {
    socket.off("receive-message");
    socket.off("no-support-online");
    socket.off("support-online");
    socket.off("support-offline");
    socket.off("support-status");
  };
}, [socket, setSupportOnline]);


//     useEffect(() => {
//   if (!socket || !conversationID) return;

//   /////////////////////////
//     // যদি সাপোর্ট অনলাইন না থাকে
//     socket.on("no-support-online", (data) => {
//       setSupportOffline(true);
//     });


//   //////////////////////////////////
//   socket.emit("joinConversation", conversationID);
//   console.log("Joined room:", conversationID);

//   socket.on("receive-message", (data) => {
//       console.log("Realtime message:", data);
//       setMessages((prev) => [...prev, data.message]);
//       setSupportData(data.support);

//       // ✅ Always use latest isOpen value (via ref)
//       if (!isOpenRef.current) {
//         setUnreadCount((prev) => prev + 1);
//         playSound("/assets/fiverr-notification.mp3");
//       }
//     });

//   // cleanup: যখন অন্য conversation এ যাবে
//   return () => {
//     socket.off("receive-message");
//     socket.emit("leaveConversation", conversationID);
//   };
// }, [socket, conversationID]);
 

const formatTime = (timestamp) => {
    if (!timestamp) return "";
    // handle objects that wrap timestamp
    const t = typeof timestamp === 'object' ? (timestamp.createdAt || timestamp.created_at || timestamp) : timestamp;
    try {
      return new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return "";
    }
};
   
// মেসেজ লোড করা (পুরনো মেসেজ)
   // 🔹 API কলের জন্য reusable ফাংশন
  const fetchMessages = useCallback(async (conversationID) => {
    try {
      const res = await axios.post(`/api/message/get-messages`, { conversationID });
      console.log(res.data);
      setNormalizedMessages(res.data.messages || []);
    } catch (err) {
      Cookies.remove('conversation');
      console.error(err);
    } finally {
      setConversationLoading(true);
    }
  }, []);

  // 🔹 useEffect: প্রথমে পেজ লোডের সময় কল
  useEffect(() => {
    const conversationID = Cookies.get('conversation');
    if (conversationID) {
      fetchMessages(conversationID);
    } else {
      setConversationLoading(true);
    }
  }, [fetchMessages]);


  // unred 
  useEffect(() => {
    const conversationID = Cookies.get('conversation');
    if (conversationID) {
      axios.post(`/api/message/get-unred`, {conversation_id:conversationID})
      .then(res => {
        console.log(res.data);
        setUnreadCount(res.data.unreadCount);
      })
      .catch(err => {
        console.error(err);
       
      });
    }
  }, []);

  // normalize messages when fetched
  const setNormalizedMessages = (arr) => {
    if (!Array.isArray(arr)) return setMessages([]);
    setMessages(arr.map(normalizeMessage));
  };

/////////////
   useEffect(() => {
   const conversationID = Cookies.get('conversation');
    if (conversationID && isOpen) {
    axios.post(`/api/message/mark-as-seen`, {conversation_id: conversationID, user_id: "Gust"});
    }
}, [message, isOpen]);

 ////////
 const handelStartChat=(e)=>{
    e.preventDefault();
    
    if (!socket || !socket.connected) {
      console.error("Socket not connected");
      alert("Connection lost. Please try again in a moment.");
      return;
    }

    setConversationLoading(false);
    setIsProgress(true);
   if(!name || !email || !message){return}
     axios.post('/api/message/start-conversation', { user1_id: name, email, message })
      .then(async res=>{
        console.log(res.data.conversation_id)
        socket.emit("send-notification", res.data.notification);
        setConversationID(res.data.conversation_id);
        Cookies.set('conversation', res.data.conversation_id);
        await new Promise(resolve => setTimeout(resolve, 2000));
         socket.emit("send-message", res.data.newMessageData); 
        setIsProgress(false);
        
        
      })
      .catch(err=>{
        setConversationLoading(true);
        console.log(err);
        setIsProgress(false);
      })

 };


 ///////
   const handleMessageSend=()=>{
    if (!socket || !socket.connected) {
      console.error("Socket not connected");
      alert("Connection lost. Please refresh the page.");
      return;
    }

    setIsProgress(true);
    const conversationID = Cookies.get('conversation');
    if (conversationID && text.length>=1) {
    axios.post(`/api/message/send-message`, {
        sender_id: "Gust", conversationID, message: text
      })
      .then(res => {
         const outgoing = res.data.newMessageData || res.data;
         const normalized = normalizeMessage(outgoing);
        // optimistically append outgoing message so user sees it immediately
        addMessage(normalized);
        socket.emit("send-message", outgoing);
         if (res.data.notification) socket.emit("send-notification", res.data.notification);
         console.log(res.data);
         setText('');
         setIsProgress(false);
      })
      .catch(err => {
        setExpireChat(true);
        console.error(err);
        setIsProgress(false);
      });
    } else {
      alert("Error");
      setIsProgress(false);
    }
  };
  //////
    useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }
}, [messages, isOpen]);

  return (
    <div className="fixed bottom-6 z-50 right-6 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
       
        <div className="mb-4 w-[370px] h-[490px] bg-[#fef2f2] border rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-[#98033a] text-white px-2 py-2 flex justify-between items-center">
           {supportData&&!supportOffline?
              <div className="flex items-center justify-between">
               <div className="flex items-center space-x-3">
                <img
                  src={supportData.avatar}
                  alt="Avatar"
                  className="w-9 h-9 rounded-full object-cover bg-[#ffffff]"
                />
          <div className="flex flex-col">
          
              <span className="font-medium text-[14px] text-[#ffffff]">
                {supportData.username}
              </span>
         
            
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-[10px] text-[#ffffff]">Connected</span>
            </div>
          </div>
        </div>
      </div>
           :<div className="flex items-center gap-1"> 
            <div className="bg-green-500 w-3 h-3 rounded-full"></div>
            <span className="font-semibold text-sm">CHAT WITH OUR CUSTOMER SERVICE</span>
           </div>}
            <button onClick={() => setIsOpen(false)} className="text-white font-bold">
              <X />
            </button>
          </div>

        {!conversationLoading?
        <div className="bg-gray-200 w-full h-full flex justify-center items-center">
          <div className="flex  w-full items-center justify-center bg-gray-200">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 animate-spin">
              <div className="h-9 w-9 rounded-full bg-gray-200"></div>
            </div>
          </div>
        </div>
        
      :

      

  <>
  {supportOffline?
    
  <div className="flex flex-col items-center p-4 justify-center h-full w-full text-gray-400">
      
      <MdEmail className="text-6xl mb-2" />
      <p className="text-sm mt-0 text-gray-500 text-center">
        Sorry we are not available at the moment please contact our sales Department at 
        <Link href="sales@hdotrade.com" className="text-[#4501ff]"> sales@hdotrade.com</Link>
      </p>
    </div>
:

<>
{expireChat?
  <div className="flex flex-col items-center justify-center h-full w-full text-gray-400">
      
      <IoChatbubble className="text-6xl mb-4 animate-bounce" />
    
      <span className="text-xl font-semibold">
        Expire Chat
      </span>
      <p className="text-sm mt-2 text-gray-500">
        Open New Chat
      </p>
    </div>
    :

  <>
        {messages.length>=1?


      // ========================================================================
      <div className="flex flex-col justify-between h-[90%]  rounded shadow-lg">
            

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="text-center text-gray-500 text-sm">— Chat Started —</div>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender_id != "Support" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`px-4 py-2 text-sm rounded-xl max-w-xs ${
                        msg.sender_id != "Support"
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          : "bg-gray-700 text-white"
                      }`}
                    >
                      {msg.content && <p>{msg.content}</p>}
                      {msg.file && (
                        <img
                          src={`${msg.file}`}
                          alt="attachment"
                          className="rounded-lg mt-2"
                        />
                      )}
                      <span className="block text-xs text-gray-300 text-right mt-1">
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="relative w-full ">
                <div className="p-4  flex items-center gap-3 ">
                <input
                value={text}
                onChange={e=>setText(e.target.value)}
                  type="text"
                  placeholder="Type your message..."
                  className="w-full flex-1 bg-[#ffffff] pl-8 px-2 py-2 rounded-full text-base text-[#000000] placeholder-[#ffffff] border-[1px] border-[#D0D5DD4D]"
                /></div>
                {isProgress?
                <button
                className="absolute right-6 bg-[#ffffff] p-1 rounded-full hover:bg-gray-700 transition cursor-pointer"
                style={{top: 'calc(1.45rem)'}} disabled={isProgress}>
                  <Send/>
                  
                </button>:
                <button onClick={handleMessageSend}
                className="absolute right-6 bg-[#ffffff] p-1 rounded-full hover:bg-[#ffffff] transition cursor-pointer"
                style={{top: 'calc(1.45rem)'}} disabled={isProgress}>
                  <Send/>
                  
                </button>}
              </div>
          
            </div>





































     // ============================================================================









    
        :
          <form onSubmit={handelStartChat} className=" p-10 space-y-6">
            <div>
              <label className="text-sm font-medium">Your Name: <span className="text-red-500">*</span></label>
              <input
              value={name}
              onChange={e=>setName(e.target.value)}
                type="text"
                placeholder="Enter your name"
                className="mt-1 w-full max-w-[300px] min-h-[35px] px-2.5 py-1.5 leading-5 rounded-md border cursor-default border-[#fde4cc]  focus:outline-none focus:ring-2 focus:ring-[#98033a]"
                required
              />
            </div>

            <div >
              <label className="text-sm font-medium">Email: <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={email}
                onChange={e=>setEmail(e.target.value)}
                placeholder="Enter Email"
                className="mt-1 w-full max-w-[300px] min-h-[35px] px-2.5 py-1.5 leading-5 rounded-md border cursor-default border-[#fde4cc]  focus:outline-none focus:ring-2 focus:ring-[#98033a]"
               required
              />
            </div>

            <div >
              <label className="text-sm font-medium">What is your question: <span className="text-red-500">*</span></label>
              <textarea
                value={message}
               onChange={e=>setMessage(e.target.value)}
                placeholder="Type your question"
               className="mt-1 w-full max-w-[300px] min-h-[35px] px-2.5 py-1.5 leading-5 rounded-md border cursor-default border-[#fde4cc]  focus:outline-none focus:ring-2 focus:ring-[#98033a]"
                rows="3"
              ></textarea>
            </div>

            <button type="submit" className="w-full max-w-[300px] bg-[#98033a] text-white py-2 rounded hover:bg-orange-600 transition">
              Start Chat
            </button>
          </form>}</>
          }</>}</>}
        </div>
 
      )}

      {/* Chat Icon */}
      {/** Disable the floating chat icon when no support is online. It will
          re-enable automatically when server emits support-status/support-online. */}
      { (isSupportOnline && !supportOffline) ? (
     <button
        onClick={() => setIsOpen(!isOpen, setUnreadCount(0))}
        className="relative text-white rounded-full shadow-lg  transition"
      >
        {/* Chat Icon */}
         <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="30" cy="30" r="30" fill="#98033a"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M30 43C39.3888 43 47 36.732 47 29C47 21.268 39.3888 15 30 15C20.6112 15 13 21.268 13 29C13 32.8747 14.9114 36.3818 18 38.9166V47L24.1673 42.1542C25.9864 42.7014 27.9509 43 30 43ZM25 30C25 31.1046 24.1046 32 23 32C21.8954 32 21 31.1046 21 30C21 28.8954 21.8954 28 23 28C24.1046 28 25 28.8954 25 30ZM32 30C32 31.1046 31.1046 32 30 32C28.8954 32 28 31.1046 28 30C28 28.8954 28.8954 28 30 28C31.1046 28 32 28.8954 32 30ZM37 32C38.1046 32 39 31.1046 39 30C39 28.8954 38.1046 28 37 28C35.8954 28 35 28.8954 35 30C35 31.1046 35.8954 32 37 32Z" fill="white"/>
          </svg>

        {/* 🔴 Notification Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      ) : (
        <button
          disabled
          aria-disabled
          title="Customer support is currently offline"
          className="relative rounded-full shadow-lg transition opacity-60 cursor-not-allowed"
        >
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="30" r="30" fill="#98033a" />
            <path fillRule="evenodd" clipRule="evenodd" d="M30 43C39.3888 43 47 36.732 47 29C47 21.268 39.3888 15 30 15C20.6112 15 13 21.268 13 29C13 32.8747 14.9114 36.3818 18 38.9166V47L24.1673 42.1542C25.9864 42.7014 27.9509 43 30 43ZM25 30C25 31.1046 24.1046 32 23 32C21.8954 32 21 31.1046 21 30C21 28.8954 21.8954 28 23 28C24.1046 28 25 28.8954 25 30ZM32 30C32 31.1046 31.1046 32 30 32C28.8954 32 28 31.1046 28 30C28 28.8954 28.8954 28 30 28C31.1046 28 32 28.8954 32 30ZM37 32C38.1046 32 39 31.1046 39 30C39 28.8954 38.1046 28 37 28C35.8954 28 35 28.8954 35 30C35 31.1046 35.8954 32 37 32Z" fill="white"/>
          </svg>
        </button>
      )}

    </div>
  );
}
