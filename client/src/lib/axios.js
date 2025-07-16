import axios from "axios";

export const AxiosInstance = axios.create({
    baseURL:'https://basic-chat-app-server.onrender.com/api',
    withCredentials:true
});
