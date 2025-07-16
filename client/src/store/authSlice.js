import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name:'auth',
    initialState:{
        loading:false,
        user:null,
        isCheckingAuth:true,
        isSigningUp:false,
        isLoggingIn:false,
        isUpdatingPassword:false,
        isUpdatingProfilePic:false,
        isUpdatingAbout:false,
    },
    reducers:{
        setLoading:(state,action) => {
            state.loading = action.payload;
        },
        setUser:(state,action) => {
            state.user = action.payload;
        },
        setIsCheckingAuth:(state,action) => {
            state.isCheckingAuth = action.payload;
        },
        setIsSigningUp:(state,action) => {
            state.isSigningUp = action.payload;
        },
        setIsLoggingIn:(state,action) => {
            state.isLoggingIn = action.payload;
        },
        setIsUpdatingPassword:(state,action) => {
            state.isUpdatingPassword = action.payload;
        },
        setIsUpdatingProfilePic:(state,action) => {
            state.isUpdatingProfilePic = action.payload;
        },
        setIsUpdatingAbout:(state,action) => {
            state.isUpdatingAbout = action.payload;
        },
    }
});

export const {
    setLoading,
    setUser,
    setIsCheckingAuth,
    setIsSigningUp,
    setIsLoggingIn,
    setIsUpdatingPassword,
    setIsUpdatingProfilePic,
    setIsUpdatingAbout
} = authSlice.actions;

export default authSlice.reducer;