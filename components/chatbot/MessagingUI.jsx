"use client";

import React, { useState, useRef, useEffect } from "react";
import { HiDotsVertical, HiOutlineDotsVertical } from "react-icons/hi";
import { FaRegPenToSquare } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import activeStatus from "@/utils/clients/activeStatus";
import axios from 'axios';
import Links from "../svg/Links";
import Image from "../svg/Image";
import Send from "../svg/Send";
import Link from "next/link";
import { FiSettings } from "react-icons/fi";
import Send2 from "../svg/Send2";
import { IoChatbubble } from "react-icons/io5";
import { MdOutlineDeleteOutline } from "react-icons/md";
import ProfileStatus from "./ProfileStatus";


export default function MessagingUI({messages, partner, conversationID, conversations, onSend, onConv, onDelete, onSupportData}) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const messagesEndRef = useRef(null);
  const [text, setText]=useState('');
 const [uploadedImage, setUploadedImage] = useState(null);
 const [uploadProgress, setUploadProgress] = useState(0);
 const [isProgress, setIsProgress]=useState(false);
 const [search, setSearch]=useState('');


  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);



  const handleMessageSend=()=>{
    if(text){
     onSend(text, uploadedImage);
      setText("");
      setUploadedImage(null);
    }
  };


  ////////////////
const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setIsProgress(true);
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(
      `/upload/image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        },
      }
    );

    setUploadedImage(response.data.url);
  } catch (error) {
    console.error('Upload failed:', error);
  } finally {
    setIsProgress(false);
  }
};




 // ফিল্টার করা ডেটা
  const filteredConversations = conversations?.filter(conv => {
    const term = search.toLowerCase();
    return (
      conv.user1_id.toLowerCase().includes(term) ||
      conv.email.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex text-white gap-2 bg-[#ffffff]" style={{height: '99vh'}}>
      {/* Sidebar */}
      <div className="w-1/3 max-w-xs bg-white p-4  rounded flex flex-col shadow-lg ">
     {/* Brand */}
          <Link
            href="/auth/dashboard"
            className="text-blue-600 md:block text-left md:pb-2 mr-0 inline-block whitespace-nowrap text-xl font-bold uppercase p-4 px-0 border-b border-[#b3b3b3]"
          >
            <div className="flex items-center">
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-md mr-2 text-white">
                <FiSettings className="text-lg" />
              </span>
              HDOTRADE Support
            </div>
          </Link>


          <ProfileStatus onSupportData={onSupportData}/>
        
        <div className="relative w-full mt-5">
          <span className="absolute left-3 top-3 flex items-center text-[#4e4c4c]">
          <FaSearch className="w-4 h-4"/>
          </span>
        <input
          type="text"
           value={search}
           onChange={(e) => setSearch(e.target.value)}
          placeholder="Search message"
          className=" bg-[#ffffff] pl-10 pr-4 py-2 w-full rounded text-sm text-[#7e7d7d] placeholder-[#7e7d7d]"
        />
        
        </div>
        <hr className="mb-4 mt-4 border-t-1 border-[#FFFFFF33]"/>

        
     
        <div className="space-y-3 overflow-y-auto">
          {filteredConversations?.map((conv, index) => (
            <div
              key={index}
              className={`flex bg-[#ffffff18] gap-3 items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-[#bebdbd]  shadow-lg border border-[#b4b3b356]
                ${String(conv.conversation_id) === String(conversationID) ? "bg-[#e2e2e2]" : ""
              }`}
              onClick={() =>onConv(conv.conversation_id)}
            > 
              <div className="flex gap-3 items-center">
                <img src={`${conv?.avatar}`} className="w-10 h-10 rounded-full" alt="avatar" />
                <div>
                  <h4 className="text-sm text-[#000000] font-semibold">{conv?.user1_id}</h4>
                  <p className="text-xs text-gray-400 w-40 truncate">{conv?.email}</p>
                  <p className="text-xs text-gray-400 w-40 truncate">{conv?.last_message}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
              <div className="text-right text-xs">
                {conv?.unread_count > 0 && (
                  <div className="flex items-center justify-center bg-[#41A8FE] w-[20px] h-[20px] rounded-full">
                  <span className="font-semibold text-[#000000] text-[12px]">
                    {conv?.unread_count}
                  </span>
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-400">{formatTime(conv?.last_message_time)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      {conversationID?
      <div className="flex-1 flex flex-col justify-between bg-[#ffffff] rounded shadow-lg">
        <div className="flex justify-between items-center p-4 border-b border-[#ada4a4]">
          <div className="flex items-center gap-3">
            <img src={`${partner?.avatar}`} className="w-10 h-10 rounded-full" alt="avatar" />
            <div>
              <h4 className="font-semibold text-black">{partner?.user1_id}</h4>
              <span className="text-xs text-green-400">{activeStatus(partner.last_seen)}</span>
            </div>
          </div>
          <MdOutlineDeleteOutline className="text-[red] text-[22px] cursor-pointer" 
          onClick={onDelete} />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="text-center text-gray-500 text-sm">— Chat Started —</div>
                {messages.map((msg, index) => {
                  const fromPartner = String(msg.sender_id) === String(partner?.user1_id);
                  return (
                    <div
                      key={index}
                      className={`flex ${fromPartner ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`px-4 py-2 text-sm rounded-xl max-w-xs ${
                          fromPartner
                            ? "bg-gray-700 text-white"
                            : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
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
                  );
                })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="relative w-full ">

        <div className="absolute left-4 top-5 flex items-center text-white">
          <div className="p-4  flex items-center gap-2">
          <Links/>
          
          
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleImageUpload}
          />
          
          </div>
         
          </div>
          

          <div className="p-4  flex items-center gap-3">
          <input
          value={text}
           onChange={e=>setText(e.target.value)}
            type="text"
            placeholder="Type your message..."
            className="w-full flex-1 bg-[#3f4242] pl-20 px-4 py-4 rounded-full text-base text-white placeholder-gray-400 border-[1px] border-[#D0D5DD4D]"
          /></div>
          <button onClick={handleMessageSend}
          className="absolute right-6 bg-black p-2 rounded-full hover:bg-gray-700 transition cursor-pointer"
          style={{top: 'calc(1.45rem)'}} disabled={isProgress}>
            <Send2/>
            
          </button>
        </div>
     
      </div>:

        <div className="flex flex-col items-center justify-center h-full w-full text-gray-400">
      
      <IoChatbubble className="text-6xl mb-4 animate-bounce" />
    
      <span className="text-xl font-semibold">
        Select Any Chat
      </span>
      <p className="text-sm mt-2 text-gray-500">
        Your conversations will appear here
      </p>
    </div>
}
    </div>
  );
}
