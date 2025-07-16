import { io } from "socket.io-client";
import { setOnlineUsers } from "@/store/socketSlice";
import { addNewMessage } from "@/store/chatSlice";

const BASE_URL = "https://basic-chat-app-server.onrender.com";
let socket = null;

export const connectSocket = (userId, dispatch) => {
  if (!userId || !dispatch) return;

  if (!socket || !socket.connected) {
    socket = io(BASE_URL, {
      query: { userId },
    });

    socket.on("connect", () => {
    });

    socket.on("getOnlineUsers", (users) => {
      dispatch(setOnlineUsers(users));
    });

    socket.on("newMessage", (message) => {
      dispatch(addNewMessage(message));
    });

    socket.on("disconnect", () => {
    });
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
