import React from 'react';
import { BsChatDots } from 'react-icons/bs';

function MessageAreaDefault() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-center px-4 animate-fadeIn">
      <BsChatDots className="text-6xl text-blue-500 mb-4 animate-bounce" />
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
        Welcome to Chat App
      </h2>
      <p className="text-gray-500 max-w-md">
        Start a conversation by selecting a user from the sidebar. Your messages are end-to-end encrypted and delivered instantly!
      </p>
    </div>
  );
}

export default MessageAreaDefault;
