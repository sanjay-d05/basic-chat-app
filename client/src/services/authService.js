import { AxiosInstance } from "@/lib/axios";
import { setIsCheckingAuth, setIsLoggingIn, setIsSigningUp, setUser } from "@/store/authSlice";
import { toast } from "react-toastify";
import { connectSocket, disconnectSocket } from "./socketService";

export const checkAuth = () => async(dispatch) => {
    try {
        const res = await AxiosInstance.get('/auth/check');
        dispatch(setUser(res.data.data));
    } catch (error) {
        dispatch(setUser(null));
        console.log('Error from logging' , error);
        
    } finally {
        dispatch(setIsCheckingAuth(false));
    }
};

export const signup = (data) => async(dispatch) => {
    dispatch(setIsSigningUp(true));
    try {
        await AxiosInstance.post('/auth/signup' , data);
        toast.success('Account Created Successfully !');
        return true;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return false;
    } finally {
        dispatch(setIsSigningUp(false));
    }
};

export const login = (data) => async(dispatch) => {
    dispatch(setIsLoggingIn(true));
    try {
        const res = await AxiosInstance.post('/auth/login',data);
        const user = res.data.data;
        dispatch(setUser(user));
        toast.success('Logged In Successfully !');
        dispatch(connectSocket(user._id , dispatch));
        return true;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return false;
    } finally {
        dispatch(setIsLoggingIn(false));
    }
};

export const logout = () => async(dispatch) => {
    try {
        await AxiosInstance.post('/auth/logout');
        dispatch(setUser(null));
        dispatch(disconnectSocket());
        toast.success('Logged Out Successfully !');
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
};