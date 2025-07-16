import { AxiosInstance } from "@/lib/axios";
import { addNewMessage, setIsSendingMessage, setLoggedInUsers, setMessages } from "@/store/chatSlice";
import { toast } from "react-toastify";
import { getSocket } from "./socketService";


export const getUsersForSidebar = () => async(dispatch) => {
    try {
        const res = await AxiosInstance.get('/message/users');
        dispatch(setLoggedInUsers(res.data.data));
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
};

export const getMessage = (recieverId) => async(dispatch) => {
    try {
        const res = await AxiosInstance.get(`/message/${recieverId}`);
        dispatch(setMessages(res.data.data));
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
}; 

export const sendMessage = (id, payload) => async (dispatch) => {
  dispatch(setIsSendingMessage(true));
  try {
    const res = await AxiosInstance.post(`/message/send/${id}`, payload);
    const message = res.data.data;

    // Optimistically add the message to chat
    dispatch(addNewMessage(message));

    // Emit to socket
    const socket = getSocket();
    if (socket) {
      socket.emit("messageSent", {
        to: id,
        message,
      });
    }

    toast.success("Message Sent");
    return true;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Send failed");
    return false;
  } finally {
    dispatch(setIsSendingMessage(false));
  }
};
