import { AxiosInstance } from "@/lib/axios";
import { setIsUpdatingAbout, setIsUpdatingPassword, setIsUpdatingProfilePic, setUser } from "@/store/authSlice";
import { toast } from "react-toastify";

export const updatePassword = async(id,data) => async(dispatch) => {
    dispatch(setIsUpdatingPassword(true));
    try {
        await AxiosInstance.put(`/auth/update-password/${id}`,data);
        toast.success('Password Updated Successfully !');
        return true;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return false;
    } finally {
        dispatch(setIsUpdatingPassword(false));
    }
}; 

export const updateProfilePic = (id,data) => async(dispatch) => {
    dispatch(setIsUpdatingProfilePic(true));
    try {
        const res = await AxiosInstance.put(`/auth/update-profile-pic/${id}`, {profilePic : data});
        dispatch(setUser(res.data.data));
        toast.success('Profile Pic Updated Successfully');
        return true;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return false;
    } finally{
        dispatch(setIsUpdatingProfilePic(false));
    }
};

export const updateAbout = (id,data) => async(dispatch) => {
    dispatch(setIsUpdatingAbout(true));
    try {
        const res= await AxiosInstance.put(`/auth/update-about/${id}`,{about : data});
        dispatch(setUser(res.data.data));
        toast.success('About Updated Successfully !');
        return true;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return false;
    } finally{
        dispatch(setIsUpdatingAbout(false));
    }
};

