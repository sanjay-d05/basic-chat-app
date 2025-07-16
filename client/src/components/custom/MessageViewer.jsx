import { getMessage, sendMessage } from '@/services/chatService';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';
import { BsSendFill } from "react-icons/bs";
import { FaImage } from "react-icons/fa6";
import { IoArrowBack } from 'react-icons/io5';
import { Button } from '../ui/button';
import { FiLoader } from 'react-icons/fi';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '../ui/dialog';

function MessageViewer() {
  const { messages, loggedInUsers, isSendingMessage } = useSelector(store => store.chats);
  const { onlineUsers } = useSelector(store => store.socket);
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const [messageData, setMessageData] = useState({ text: '' });
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [imageData, setImageData] = useState({ image: '', imageName: '' });
  const [isViewActive, setIsViewActive] = useState(false);

  const recieverId = location.pathname.split('/')[2];
  const messageUser = loggedInUsers.find(item => item._id === recieverId);
  const isOnline = onlineUsers.includes(messageUser?._id);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (recieverId) {
      setLoadingMessages(true);
      dispatch(getMessage(recieverId)).then(() => {
        setLoadingMessages(false);
      });
    }
  }, [recieverId, dispatch]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData({
          image: reader.result,
          imageName: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      text: messageData.text,
      image: imageData.image || '',
    };

    const success = await dispatch(sendMessage(recieverId, payload));
    if (success) {
      setMessageData({ text: '' });
      setImageData({ image: '', imageName: '' });
    }
  };

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          {messageUser?.profilePic ? (
            <img src={messageUser.profilePic} alt="User" className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-black">
              {messageUser?.name[0]}
            </div>
          )}
          <div>
            <p className="font-medium">{messageUser?.name}</p>
            <p className={`text-xs ${isOnline ? 'text-green-500' : 'text-gray-400'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <IoArrowBack className="md:hidden text-xl cursor-pointer" onClick={() => navigate('/')} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 custom-scrollbar">
        {loadingMessages ? (
          <div className="flex justify-center items-center text-gray-400">
            <svg className="animate-spin h-6 w-6 mr-2 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Loading messages...
          </div>
        ) : (
          <>
            {Array.isArray(messages) && messages.length > 0 ? (
              messages.map((item, index) => {
                const isSentByMe = item.senderId === user._id;
                const alignStyle = isSentByMe ? 'items-end self-end' : 'items-start self-start';
                const bubbleStyle = isSentByMe ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black';

                return (
                  <div key={index} className={`flex flex-col ${alignStyle} w-full`}>
                    <div className={`rounded-2xl overflow-hidden ${bubbleStyle} shadow max-w-[80%] md:max-w-xs`}>
                      {item.image && (
                        <div className="relative group">
                          <img
                            src={item.image}
                            alt="sent"
                            className="object-cover w-full h-auto"
                          />
                          <div className="absolute bottom-2 right-2 flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                            <Dialog>
                              <div className="relative">
                                <DialogTrigger asChild>
                                  <Button
                                    onClick={() => setIsViewActive(true)}
                                    className="text-xs px-3 py-1 rounded bg-white/80 text-black shadow hover:bg-white"
                                  >
                                    View
                                  </Button>
                                </DialogTrigger>

                                <DialogContent className="max-h-[95vh] w-full overflow-y-auto">
                                  <DialogHeader className="my-0 py-2 border-b-2">
                                    <DialogTitle className="py-0 my-0">
                                      {isSentByMe ? `${user.name}.jpg` : `${messageUser.name}.jpg`}
                                    </DialogTitle>
                                  </DialogHeader>

                                  <div className="w-full max-h-[75vh] overflow-auto flex justify-center items-center">
                                    <img
                                      src={item.image}
                                      alt="Preview"
                                      className="max-h-full w-auto object-contain"
                                    />
                                  </div>
                                </DialogContent>
                              </div>
                            </Dialog>
                            <Button
                              className="text-xs px-3 py-1 rounded bg-white/80 text-black shadow hover:bg-white"
                              onClick={() => handleDownload(item?.image, isSentByMe ? `${user?.name}.jpg` : `${messageUser?.name}.jpg`)}
                            >
                              Download
                            </Button>
                          </div>
                        </div>
                      )}
                      {item.text && (
                        <div className="px-3 py-2 text-sm break-words">{item.text}</div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-400 mt-10">Send a message to start the conversation</div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="relative p-3 bg-white shadow-inner">
        {imageData.image && (
          <div className="absolute -top-52 left-4 rounded-lg shadow-lg p-2 w-64 z-10 bg-white/90 backdrop-blur-sm border">
            <div className="relative">
              <img src={imageData.image} alt="preview" className="h-36 w-full object-cover rounded-md" />
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                onClick={() => setImageData({ image: '', imageName: '' })}
              >
                ✕
              </button>
            </div>
            <input
              type="text"
              placeholder="Add a caption..."
              className="mt-2 w-full text-sm p-1 border rounded bg-white"
              value={messageData.text}
              onChange={(e) => setMessageData({ ...messageData, text: e.target.value })}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Message..."
            className="flex-1 border-black"
            value={messageData.text}
            onChange={(e) => setMessageData({ ...messageData, text: e.target.value })}
          />
          <label className="bg-blue-600 hover:bg-blue-700 cursor-pointer inline-flex items-center justify-center rounded text-white w-10 h-10">
            <FaImage size={18} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          <Button
            type="submit"
            className="bg-blue-600 w-10 h-10 p-2"
            disabled={!messageData.text && !imageData.image}
          >
            {isSendingMessage ? <FiLoader className="animate-spin size-6" /> : <BsSendFill size={18} />}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default MessageViewer;
