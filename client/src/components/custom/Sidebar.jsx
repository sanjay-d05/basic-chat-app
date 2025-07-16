import React, { useEffect, useState } from 'react';
import { IoSearch, IoPersonCircle, IoClose } from 'react-icons/io5';
import { MdOutlineScreenSearchDesktop } from "react-icons/md";
import { Separator } from '../ui/separator';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/services/authService';
import { getUsersForSidebar } from '@/services/chatService';
import { getSocket } from '@/services/socketService';
import ChatCard from './ChatCard';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

function Sidebar() {
  const { user } = useSelector(store => store.auth);
  const { loggedInUsers } = useSelector(store => store.chats);
  const { onlineUsers } = useSelector(store => store.socket);
  const dispatch = useDispatch();

  const [showProfile, setShowProfile] = useState(false);
  const [showOnlyOnline, setShowOnlyOnline] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = async () => {
    await dispatch(logout());
  };

  useEffect(() => {
    dispatch(getUsersForSidebar());
  }, [loggedInUsers]);

  useEffect(() => {
    const socket = getSocket();

    if (socket) {
      socket.on("user-logged-in", () => {
        dispatch(getUsersForSidebar());
      });

      socket.on("user-logged-out", () => {
        dispatch(getUsersForSidebar());
      });
    }

    return () => {
      if (socket) {
        socket.off("user-logged-in");
        socket.off("user-logged-out");
      }
    };
  }, [dispatch]);

  // Combined filter: online + search
  const filteredUsers = loggedInUsers
    .filter(u => {
      if (showOnlyOnline && !onlineUsers.includes(u._id)) return false;
      if (!u.name?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });

  return (
    <div className='h-full w-full flex flex-col px-2 py-3 relative overflow-y-auto'>

      {/* Header */}
      <div className='flex justify-between items-center py-2 border-b-2'>
        <h2 className='font-bold text-lg text-blue-600'>NexChat</h2>
        <div className='flex justify-center items-center gap-3' onClick={() => setShowProfile(!showProfile)}>
          {user?.profilePic ? (
            <img className='w-8 h-8 rounded-[50%]' src={user.profilePic} alt="User" />
          ) : (
            <div className='flex justify-center items-center bg-gray-300 rounded-[50%] w-8 h-8'>
              {user.name[0]}
            </div>
          )}
        </div>
      </div>

         {/* Search input (always visible for better UX) */}
      <div className='pb-2'>
        <div className='flex justify-center items-center gap-2 w-full border-b px-1 py-1'>
          <Input
            className='w-full'
            type='text'
            placeholder='Search users by name...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MdOutlineScreenSearchDesktop size={20} />
        </div>
      </div>

      {/* Online-only checkbox */}
      <div className='py-3 flex items-center gap-2 border-b-2'>
        <Input
          id="online-only"
          type="checkbox"
          checked={showOnlyOnline}
          onChange={(e) => setShowOnlyOnline(e.target.checked)}
          className="w-4 h-4"
        />
        <Label htmlFor="online-only">Online Users Only</Label>
      </div>

      {/* Chat list */}
      <div className='flex-1 overflow-y-auto pb-3 custom-scrollbar'>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((item, index) => (
            <ChatCard key={index} item={item} setShowProfile={setShowProfile}/>
          ))
        ) : (
          <p className="text-sm text-center text-gray-500 mt-3">No users found.</p>
        )}
      </div>

      {/* Profile dropdown */}
      {showProfile && (
        <div className='absolute top-14 right-2 bg-gray-300 text-black w-40 text-center shadow-lg rounded-2xl py-2 z-10'>
          <Link className='hover:underline' to={'/profile'} onClick={() => setShowProfile(false)}>Profile</Link>
          <Separator className='my-1' />
          <p className='my-0 py-0 cursor-pointer' onClick={handleLogout}>Logout</p>
        </div>
      )}

    </div>
  );
}

export default Sidebar;
