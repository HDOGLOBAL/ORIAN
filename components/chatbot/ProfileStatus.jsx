import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import axios from 'axios';

const avatars = [
  "/assets/support-avatar/avatar-1.png",
  "/assets/support-avatar/avatar-2.png",
  "/assets/support-avatar/avatar-3.png",
  "/assets/support-avatar/avatar-4.png",
  "/assets/support-avatar/avatar-5.png",
];

const ProfileStatus = ({onSupportData}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState('https://media.tenor.com/khzZ7-YSJW4AAAAM/cargando.gif');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(()=>{
     axios.post(`/api/support/get`)
      .then(res => {
       console.log(res.data);
       setName(res.data.username);
       setSelectedAvatar(res.data.avatar);
       setIsConnected(true);
       onSupportData({username: res.data.username, avatar:res.data.avatar})
      })
      .catch(err => {
        alert("Error");
        console.error(err);
      });
        
  },[]);

  ////////
  const handleSave = () => {
    if(!selectedAvatar||!name){return}
    axios.post(`/api/support/update`, {
        username: name, avatar: selectedAvatar
      })
      .then(res => {
        setIsEditing(false);
       console.log(res.data);
      })
      .catch(err => {
        alert("Error");
        console.error(err);
      });
  };

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-md p-2 w-full mt-3 shadow-sm">
      {/* Top Section */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <img
            src={selectedAvatar}
            alt="Avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex flex-col">
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            ) : (
              <span className="text-gray-900 font-medium text-[15px]">
                {name}
              </span>
            )}
            {isConnected&&
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-sm text-gray-500">Connected</span>
            </div>}
          </div>
        </div>

        {/* Edit Button */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <FaRegEdit size={18} />
        </button>
      </div>

      {/* Avatar Picker (only when editing) */}
      {isEditing && (
        <>
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2">Choose Avatar:</p>
            <div className="flex space-x-2">
              {avatars.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt={`Avatar ${index + 1}`}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`w-10 h-10 rounded-full cursor-pointer border-2 ${
                    selectedAvatar === avatar
                      ? "border-blue-500"
                      : "border-transparent hover:border-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-3">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileStatus;
